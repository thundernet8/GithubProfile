import GithubService from "./GithubService";
import RedisService from "./RedisService";
import ConsoleWrapper from "../util/ConsoleWrapper";
import Repo from "../interface/Repo";
import Commit from "../interface/Commit";

export default class ProfileService {
    public async getUserProfile(username: string) {
        const redisService = RedisService.getInstance();

        // TODO use emitter to prevent same requests at same time

        try {
            const cacheKey = `_profile_${username}`;
            const cacheProfile = await redisService.getAsync(cacheKey);
            if (cacheProfile) {
                return JSON.parse(cacheProfile);
            } else {
                const profile = await this.getFreshProfile(username);
                redisService.setWithExpiryAsync(cacheKey, JSON.stringify(cacheKey), 3600);
                return profile;
            }
        } catch (err) {
            ConsoleWrapper.error(err);
        }
    }

    private async getFreshProfile(username: string) {
        const gh = GithubService.getInstance();

        try {
            const repos = await gh.getUserRepos(username);
            // Filter forked repos and remove unused fields
            const filteredRepos: Repo[] = repos.filter(repo => !repo.fork).map(repo => ({
                id: repo.id,
                name: repo.name,
                owner: repo.owner.login,
                url: repo.html_url,
                description: repo.description,
                language: repo.language,
                forks: repo.forks_count,
                stars: repo.stargazers_count
            }));

            const reposPerLan = this.getReposPerLanInfo(filteredRepos);
            const starsPerLan = this.getStarsPerLanInfo(filteredRepos);
            const { commitsPerLan, commitsPerRepo } = await this.getCommitsPerLanAndPerRepoInfo(
                filteredRepos
            );
            const starsPerRepo = this.getStarsPerRepoInfo(filteredRepos);

            return {
                reposPerLan,
                starsPerLan,
                commitsPerLan,
                commitsPerRepo,
                starsPerRepo
            };
        } catch (err) {
            ConsoleWrapper.error(err);
        }
    }

    private getReposPerLanInfo(repos: Repo[]) {
        const map = {};
        repos.forEach(repo => {
            const { language } = repo;
            if (language) {
                if (map[language]) {
                    map[language].push(repo);
                } else {
                    map[language] = [repo];
                }
            }
        });

        return map;
    }

    private getStarsPerLanInfo(repos: Repo[]) {
        const map = {};
        repos.forEach(repo => {
            const { language } = repo;
            if (language) {
                if (map[language]) {
                    map[language] += repo.stars;
                } else {
                    map[language] = repo.stars;
                }
            }
        });

        return map;
    }

    private async getCommitsPerLanAndPerRepoInfo(repos: Repo[]) {
        const lanMap = {};
        const repoMap = {};
        const gh = GithubService.getInstance();
        for (let repo of repos) {
            const { language, name, owner } = repo;
            const cacheKey = `_commits_${owner}_${name}`;
            const cacheCommits = await RedisService.getInstance().getAsync(cacheKey);

            let commits: Commit[];
            if (cacheCommits) {
                commits = JSON.parse(cacheCommits);
            } else {
                const freshCommits = await gh.getRepoCommits(name, owner);
                // Filter others' commits and remove unused fields
                commits = freshCommits
                    .filter(commit => commit.committer.login === owner)
                    .map(commit => {
                        const { committer } = commit.commit;
                        return {
                            sha: commit.sha,
                            owner,
                            date: committer.date,
                            message: commit.commit.message,
                            url: commit.html_url
                        };
                    });
                // There may be too many commits data and requests, and they are not so important so use cache as more as better
                RedisService.getInstance().setWithExpiryAsync(
                    cacheKey,
                    JSON.stringify(commits),
                    3600 * 24
                );
            }

            if (language) {
                if (lanMap[language]) {
                    lanMap[language] = lanMap[language].concat(commits);
                } else {
                    lanMap[language] = [commits];
                }
            }
            repoMap[name] = {
                repo,
                commits
            };
        }

        return {
            commitsPerLan: lanMap,
            commitsPerRepo: repoMap
        };
    }

    private getStarsPerRepoInfo(repos: Repo[]) {
        const map = {};
        repos.forEach(repo => {
            const { stars, name } = repo;
            map[name] = {
                stars,
                repo
            };
        });

        return map;
    }
}
