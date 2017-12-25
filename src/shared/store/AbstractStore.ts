import { IStoreArgument, IMatch, ILocation } from "../interface/IStoreArgument";

export default abstract class AbstractStore {
    private match: IMatch;

    private location: ILocation;

    private cookies: string;

    public get Match() {
        return this.match || null;
    }

    public get Location() {
        return this.location || null;
    }

    protected constructor(arg: IStoreArgument) {
        this.match = arg.match;
        this.location = arg.location;
    }

    protected reset(arg: IStoreArgument) {
        this.match = arg.match;
        this.location = arg.location;
    }

    // SSR 预加载数据
    abstract fetchData(): Promise<any>;

    // 序列化(转换成plain object, 继承类中继续添加数据)
    public toJSON(): object {
        const { match, location, cookies } = this;
        return {
            match,
            location,
            cookies
        };
    }

    // 反序列化(先创建一个空实例，并使用此方法从json中获取信息填充)
    public fromJSON(json: any): AbstractStore {
        if (!json) {
            return this;
        }
        const { match, location, cookies } = json;
        if (typeof match !== "undefined") {
            this.match = match;
        }
        if (typeof location !== "undefined") {
            this.location = location;
        }
        if (typeof cookies !== "undefined") {
            this.cookies = cookies;
        }
        return this;
    }
}
