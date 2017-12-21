export interface IMatch {
    isExact: boolean;
    params: { [key: string]: string };
    path: string;
    url: string;
}

export interface ILocation {
    url?: string;
    hash: string;
    pathname: string;
    search: string;
}

export interface IStoreArgument {
    match: IMatch;
    location: ILocation;
}
