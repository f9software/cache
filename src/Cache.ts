import {IGateway} from "./Gateway";
import {Manager} from "./Manager";

export interface ICache {
    get(key: string);

    set(key: string, value: any);

    remove(key: string);

    removeMany(keys: string[]);

    clear();

    getLifetime(): {[key: string]: number};
}

export class Cache implements ICache {
    public static readonly LIFETIME_KEY: string = '#';

    /**
     *
     * @param {IGateway} gateway
     * @param {number} lifetime Cache lifetime in seconds.
     */
    constructor(private gateway: IGateway, private lifetime: number = 3600) {
        Manager.register(this);
    }

    get(key: string) {
        return this.gateway.get(key);
    }

    set(key: string, value: any, lifetime?: number) {
        this.gateway.set(key, value);

        if (key !== Cache.LIFETIME_KEY) {
            this.updateLifetime(key, lifetime || this.lifetime);
        }
    }

    remove(key: string) {
        this.gateway.remove(key);
    }

    clear() {
        this.gateway.clear();
        this.setLifetime({});
    }

    public getLifetime(): {[key: string]: number} {
        return this.gateway.get(Cache.LIFETIME_KEY) || {};
    }

    private updateLifetime(key, lifetime: number) {
        const lifetimeAll = this.getLifetime();
        lifetimeAll[key] = Math.round(new Date().getTime() / 1000) + lifetime;
        this.setLifetime(lifetimeAll);
    }

    private setLifetime(lifetime) {
        this.gateway.set(Cache.LIFETIME_KEY, lifetime);
    }

    /**
     * Remove multiple keys at once. It is optimal to use this method when removing multiple keys at once because the
     * gateway only updates the lifetime once.
     * @param {string} keys
     */
    public removeMany(keys: string[]) {
        keys.forEach(key => this.gateway.remove(key));

        const lifetime = this.getLifetime();
        Object.keys(lifetime)
            .forEach(key => {
                const index = keys.indexOf(key);

                if (index > -1) {
                    delete lifetime[key];
                }
            });

        this.setLifetime(lifetime);
    }
}