import WebApi from "./WebApi";
import User from "../../../server/interface/User";

export interface FetchProfileReq {
    username: string;
}

export interface FetchProfileResp extends User {}

export function FetchProfile(playload: FetchProfileReq) {
    return WebApi.Get<FetchProfileResp>(`profile/${playload.username}`, {});
}
