import { observable, action, computed } from "mobx";
import { IStoreArgument } from "../interface/IStoreArgument";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";
import Profile from "../../../server/interface/Profile";
import { FetchProfile } from "../api/Profile";

declare var window;

/**
 * 全局Store(单例)
 */
export default class GlobalStore extends AbstractStore {
    private static instance: GlobalStore;

    public static get Instance() {
        return GlobalStore.getInstance({} as any);
    }

    /**
     * @param arg SSR环境下组件生命周期之前实例化store, 见ssr/render.ts
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore(arg);
        }
        return GlobalStore.instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.globalStore) {
                this.fromJSON(initialState.globalStore);
            } else {
                this.fetchData();
            }
        }
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        if (GlobalStore.instance) {
            GlobalStore.instance = null as any;
        }
        GlobalStore.instance = GlobalStore.getInstance(arg);
    }

    public destroy() {
        GlobalStore.instance = null as any;
    }

    @observable profile: Profile;

    @observable loading: boolean = false;

    @action
    fetchProfile = (username: string) => {
        if (this.loading) {
            return Promise.reject(false);
        }
        this.loading = true;
        return FetchProfile({ username })
            .then(resp => {
                this.profile = resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @computed
    get URL() {
        if (IS_NODE) {
            return this.Location.url;
        }
        return `${location.protocol}//${location.host}${location.pathname}`;
    }

    @computed
    get totalStars() {
        const { profile } = this;
        if (!profile) {
            return 0;
        }
        return profile.starsPerLan.reduce((previous, current) => {
            return previous + current.stars;
        }, 0);
    }

    @computed
    get totalCommits() {
        const { profile } = this;
        if (!profile) {
            return 0;
        }
        return profile.commitsPerLan.reduce((previous, current) => {
            return previous + current.count;
        }, 0);
    }

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const { username } = this.Match.params;
        const promises: Promise<any>[] = [];
        promises.push(this.fetchProfile(username));
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        return Object.assign(obj, {
            profile: this.profile
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { profile } = json;
        if (typeof profile !== "undefined") {
            this.profile = profile;
        }
        return this;
    }
}
