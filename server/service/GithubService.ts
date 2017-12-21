import * as GithubApi from "github";
import { GITHUB_TOKEN } from "../../env";

const github = new GithubApi({
    timeout: 5000,
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: "/api/v3", // for some GHEs; none for GitHub
    protocol: "https",
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
        Authorization: `Bearer ${GITHUB_TOKEN}`
    },
    rejectUnauthorized: false, // default: true
    family: 6
});
