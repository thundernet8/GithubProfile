import * as Redis from "redis";
import * as bluebird from "bluebird";
import { IS_PROD, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, IS_DOCKER } from "../../env";
import ConsoleWrapper from "../util/ConsoleWrapper";

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

export default class RedisService {
    private static instance: RedisService;
    private client;

    private constructor() {
        this.client = Redis.createClient({
            host: IS_DOCKER ? "redis" : REDIS_HOST,
            port: REDIS_PORT,
            password: REDIS_PASSWORD
        });

        this.client.on("error", err => {
            if (!IS_PROD) {
                ConsoleWrapper.error(err);
            }
            throw err;
        });
    }

    public static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public set(key: string, value) {
        // TODO logger
        return this.client.set(key, value);
    }

    public async setAsync(key: string, value) {
        // TODO logger
        try {
            const result = this.client.setAsync(key, value);
            return result;
        } catch (err) {
            ConsoleWrapper.error(err);
            throw err;
        }
    }

    /**
     *
     * @param key
     * @param value
     * @param expiry seconds after which the value would be expired
     */
    public setWithExpiry(key: string, value, expiry: number) {
        // TODO logger
        return this.client.set(key, value, "EX", expiry);
    }

    public async setWithExpiryAsync(key: string, value, expiry: number) {
        // TODO logger
        try {
            const result = this.client.setAsync(key, value, "EX", expiry);
            return result;
        } catch (err) {
            ConsoleWrapper.error(err);
            throw err;
        }
    }

    public get(key: string) {
        // TODO logger
        return this.client.get(key);
    }

    public async getAsync(key: string) {
        // TODO logger
        try {
            const result = this.client.getAsync(key);
            return result;
        } catch (err) {
            ConsoleWrapper.error(err);
            throw err;
        }
    }

    public del(key: string) {
        // TODO logger
        return this.client.del(key);
    }
}
