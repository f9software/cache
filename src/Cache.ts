import {IGateway} from "./Gateway";

// export interface CacheConstructor {
//     new(id: string, proxy: ICacheGateway): ICache;
// }

export interface ICache {
    get(key: string);

    set(key: string, value: any);

    clear();
}

export class Cache implements ICache {
    constructor(private proxy: IGateway) {
    }

    get(key: string) {
        return this.proxy.get(key);
    }

    set(key: string, value) {
        this.proxy.set(key, value);
    }

    clear() {
        this.proxy.clear();
    }
}