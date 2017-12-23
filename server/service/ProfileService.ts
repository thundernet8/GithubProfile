import GithubService from "./GithubService";
import RedisService from "./RedisService";
import ConsoleWrapper from "../util/ConsoleWrapper";
import Repo from "../interface/Repo";
import Commit from "../interface/Commit";
import User from "../interface/User";

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
            const user = await gh.getUser(username);
            if (user.type !== "User") {
                throw new Error("organization profile are not available");
            }
            const {
                login,
                name,
                email,
                public_repos,
                created_at,
                updated_at,
                html_url,
                avatar_url,
                bio,
                company,
                blog,
                location,
                followers,
                following
            } = user;

            const basicProfile: User = {
                login,
                name,
                email,
                repos: public_repos,
                join: created_at,
                update: updated_at,
                link: html_url,
                avatar: avatar_url,
                bio,
                company,
                blog,
                location,
                followers,
                following
            };

            if (Number(public_repos) === 0) {
                return {
                    basicProfile
                };
            }

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
                repos: filteredRepos.reduce((previous, current) => {
                    previous[current.id] = current;
                    return previous;
                }, {}),
                reposPerLan,
                starsPerLan,
                commitsPerLan,
                commitsPerRepo,
                starsPerRepo,
                basicProfile
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
                    map[language].push(repo.id);
                } else {
                    map[language] = [repo.id];
                }
            }
        });

        const data = Object.keys(map)
            .map(lan => {
                return {
                    lan,
                    repos: map[lan],
                    count: map[lan] && map[lan].length
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
                const commits = lanMap[lan];
                return {
                    lan,
                    // commits: lanMap[lan],
                    count: commits && commits.length
                };
            })
            .sort((a, b) => b.count - a.count);

        const repoData = Object.keys(repoMap)
            .map(name => {
                const { repo, commits } = repoMap[name];
                return {
                    repo: repo.id,
                    count: commits && commits.length
                };
            })
            .sort((a, b) => b.count - a.count);

        return {
            commitsPerLan: lanData,
            commitsPerRepo: repoData
        };
    }

    private getStarsPerRepoInfo(repos: Repo[]) {
        return repos
            .map(repo => {
                const { stars } = repo;
                return {
                    stars,
                    repo: repo.id
                };
            })
            .sort((a, b) => b.stars - a.stars); // sort desc by stars
    }
}
