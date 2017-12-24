import User from "./User";
import Repo from "./Repo";

export default interface Profile {
    repos: { [id: number]: Repo };
    commits: string[];
    reposPerLan: { lan: string; repos: number[]; count: number }[];
    starsPerLan: { lan: string; stars: number }[];
    commitsPerLan: { lan: string; count: number }[];
    commitsPerRepo: { repo: string; count: number }[];
    starsPerRepo: { repo: number; stars: number }[];
    basicProfile: User;
};
