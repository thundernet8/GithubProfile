import WebApi from "./WebApi";
import Profile from "../../../server/interface/Profile";

export interface FetchProfileReq {
    username: string;
}

export interface FetchProfileResp extends Profile {}

export function FetchProfile(playload: FetchProfileReq) {
    return WebApi.Get<FetchProfileResp>(`profile/${playload.username}`, {});
}
