import GithubService from "./GithubService";

export default class ProfileService {
    public getUserProfile(username: string) {
        // TODO
        const gh = new GithubService();
        return gh.getUserRepos(username);
    }
}
