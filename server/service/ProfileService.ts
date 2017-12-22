import GithubService from "./GithubService";
import RedisService from "./RedisService";
import ConsoleWrapper from "../util/ConsoleWrapper";
import Repo from "../interface/Repo";
import Commit from "../interface/Commit";

export default class ProfileService {
    public async getUserProfile(username: string) {
        // TODO use emitter to prevent same requests at same time

        try {
            const redisService = RedisService.getInstance();

            const cacheKey = `_profile_${username}`;
            const cacheProfile = await redisService.getAsync(cacheKey);
            if (cacheProfile) {
                return JSON.parse(cacheProfile);
            } else {
                const profile = await this.getFreshProfile(username);
                redisService.setWithExpiryAsync(cacheKey, JSON.stringify(profile), 3600);
                return profile;
            }
        } catch (err) {
            ConsoleWrapper.error(err);
            throw err;
        }
    }

    private async getFreshProfile(username: string) {
        const gh = GithubService.getInstance();

        try {
            const repos = await gh.getUserRepos(username);
            // Filter forked repos and remove unused fields
            const filteredRepos: Repo[] = repos
                .filter(repo => !repo.fork && repo.size > 0)
                .map(repo => ({
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
            throw err;
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

        const data = Object.keys(map)
            .map(lan => {
                return {
                    lan,
                    repos: map[lan]
                };
            })
            .sort((a, b) => b.repos.length - a.repos.length);

        return data;
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

        const data = Object.keys(map)
            .map(lan => {
                return {
                    lan,
                    stars: map[lan]
                };
            })
            .sort((a, b) => b.stars - a.stars);

        return data;
    }

    private async getCommitsPerLanAndPerRepoInfo(repos: Repo[]) {
        const lanMap = {};
        const repoMap = {};
        const gh = GithubService.getInstance();
        const promises: Promise<any>[] = [];
        for (let repo of repos) {
            const { language, name, owner } = repo;
            const cacheKey = `_commits_${owner}_${name}`;

            promises.push(
                RedisService.getInstance()
                    .getAsync(cacheKey)
                    .then(cacheCommits => {
                        if (cacheCommits) {
                            return JSON.parse(cacheCommits) as Commit[];
                        } else {
                            return gh.getRepoCommits(name, owner).then(freshCommits => {
                                // Filter others' commits and remove unused fields
                                const commits: Commit[] = freshCommits
                                    .filter(
                                        commit => commit.author && commit.author.login === owner
                                    )
                                    .map(commit => {
                                        return {
                                            sha: commit.sha,
                                            owner,
                                            date: commit.commit.author.date,
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

                                return commits;
                            });
                        }
                    })
                    .then(commits => {
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
                    })
            );
        }

        await Promise.all(promises);

        const lanData = Object.keys(lanMap)
            .map(lan => {
                return {
                    lan,
                    commits: lanMap[lan]
                };
            })
            .sort((a, b) => b.commits.length - a.commits.length);

        const repoData = Object.keys(repoMap)
            .map(name => {
                return repoMap[name];
            })
            .sort((a, b) => b.commits.length - a.commits.length);

        return {
            commitsPerLan: lanData,
            commitsPerRepo: repoData
        };
    }

    private getStarsPerRepoInfo(repos: Repo[]) {
        const data: any[] = [];
        repos.forEach(repo => {
            const { stars } = repo;
            data.push({
                stars,
                repo
            });
        });

        // sort desc by stars
        data.sort((a, b) => b - a);
        return data;
    }
}
