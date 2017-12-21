import * as GithubApi from "github";
import RateLimit from "../model/RateLimit";
import { GITHUB_TOKEN } from "../../env";

export default class GithubService {
    private github;
    private _rateLimit: RateLimit;

    constructor() {
        this.github = new GithubApi({
            timeout: 5000,
            host: "api.github.com", // should be api.github.com for GitHub
            protocol: "https",
            port: 443,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
                Authorization: `Bearer ${GITHUB_TOKEN}`
            },
            rejectUnauthorized: false // default: true
        });
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

    public async getUser(username: string) {
        const resp = await this.github.users.getForUser({ username });
        if (resp) {
            this.updateRateLimit(resp.meta);
            return resp.data;
        }
        return null;
    }

    public async getUserRepos(username: string) {
        let repos = [];
        let hasNextPage = true;
        let page = 1;
        while (hasNextPage) {
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
}
