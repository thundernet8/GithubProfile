import * as GithubApi from "github";
import * as schedule from "node-schedule";
import RateLimit from "../model/RateLimit";
import { GITHUB_TOKEN, IS_PROD } from "../../env";
import ConsoleWrapper from "../util/ConsoleWrapper";

export default class GithubService {
    private static instance: GithubService;
    private github;
    private _rateLimit: RateLimit;
    private _scheduleRateLimitJob;

    private constructor() {
        const headers: any = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36"
        };
        if (GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
        }

        this.github = new GithubApi({
            timeout: 5000,
            host: "api.github.com", // should be api.github.com for GitHub
            protocol: "https",
            port: 443,
            headers,
            rejectUnauthorized: false // default: true
        });

        if (!this._scheduleRateLimitJob) {
            // fetch rate limit every minute
            this._scheduleRateLimitJob = schedule.scheduleJob("*/1 * * * *", () => {
                if (!IS_PROD) {
                    ConsoleWrapper.log("Executing scheduled rate limit job");
                }
                this.fetchRateLimit();
            });
        }
    }

    public static getInstance() {
        if (!GithubService.instance) {
            GithubService.instance = new GithubService();
        }
        return GithubService.instance;
    }

    private updateRateLimit(meta) {
        this._rateLimit = new RateLimit(
            meta["x-ratelimit-limit"],
            meta["x-ratelimit-remaining"],
            meta["x-ratelimit-reset"]
        );
    }

    public get rateLimit() {
        return this._rateLimit;
    }

    public static cancelScheduleJob() {
        if (GithubService.instance && GithubService.instance._scheduleRateLimitJob) {
            GithubService.instance._scheduleRateLimitJob.cancel();
        }
    }

    public async getUser(username: string) {
        const resp = await this.github.users.getForUser({ username });
        if (resp) {
            this.updateRateLimit(resp.meta);
            return resp.data;
        }
        return null;
    }

    public async getUserRepos(username: string): Promise<any[]> {
        let repos = [];
        let hasNextPage = true;
        let page = 1;
        while (hasNextPage) {
            if (!IS_PROD) {
                ConsoleWrapper.log(`Request repos for user ${username} on page ${page}`);
            }
            const resp = await this.github.repos.getForUser({ username, page, per_page: 100 });
            if (resp) {
                this.updateRateLimit(resp.meta);
                hasNextPage = resp.data.length === 100;
                repos = repos.concat(resp.data);
                page++;
            } else {
                hasNextPage = false;
            }
        }

        return repos;
    }

    public async getRepoCommits(repo: string, owner: string): Promise<any[]> {
        let commits = [];
        let hasNextPage = true;
        let page = 1;
        while (hasNextPage) {
            if (!IS_PROD) {
                ConsoleWrapper.log(`Request commits for repo ${owner}/${repo} on page ${page}`);
            }
            const resp = await this.github.repos.getCommits({ owner, repo, page, per_page: 100 });
            if (resp) {
                this.updateRateLimit(resp.meta);
                hasNextPage = resp.data.length === 100;
                commits = commits.concat(resp.data);
                page++;
            } else {
                hasNextPage = false;
            }
        }

        return commits;
    }

    // cron event to update rate limit
    public async fetchRateLimit(): Promise<RateLimit> {
        try {
            const resp = await this.github.users.getForUser({ username: "thundernet8" });
            if (resp) {
                this.updateRateLimit(resp.meta);
                return this.rateLimit;
            }
            throw new Error();
        } catch (err) {
            this.updateRateLimit({
                "x-ratelimit-limit": 0,
                "x-ratelimit-remaining": 0,
                "x-ratelimit-reset": 0
            });
            if (!IS_PROD) {
                ConsoleWrapper.error(err);
            }
            return this.rateLimit;
        }
    }
}
