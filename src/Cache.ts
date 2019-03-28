import {IGateway} from "./Gateway";
import {Manager} from "./Manager";

export interface ICache {
    getKeys(): string[];

    get(key: string): any;

    set(key: string, value: any): void;

    remove(key: string): void;

    removeMany(keys: string[]): void;

    clear(): void;

    getLifetime(): {[key: string]: number};
}

export class Cache implements ICache {
    public static readonly LIFETIME_KEY: string = "#";

    /**
     *
     * @param {IGateway} gateway
     * @param {number} lifetime Cache lifetime in seconds.
     */
    constructor(private gateway: IGateway, private lifetime: number = 3600) {
        Manager.register(this);
    }

    public getKeys(): string[] {
        return this.gateway.getKeys().filter((key) => key !== Cache.LIFETIME_KEY);
    }

    public get(key: string): any {
        return this.gateway.get(key);
    }

    public set(key: string, value: any, lifetime: number = this.lifetime) {
        this.gateway.set(key, value);
        this.updateLifetime(key, lifetime);
    }

    public remove(key: string) {
        this.gateway.remove(key);
    }

    public clear() {
        this.gateway.clear();
        this.setLifetime({});
    }

    public getLifetime(): {[key: string]: number} {
        return this.gateway.get(Cache.LIFETIME_KEY) || {};
    }

    /**
     * Remove multiple keys at once. It is optimal to use this method when removing multiple keys at once because the
     * gateway only updates the lifetime once.
     * @param {string} keys
     */
    public removeMany(keys: string[]) {
        keys.forEach((key) => this.gateway.remove(key));

        const lifetime = this.getLifetime();
        Object.keys(lifetime)
            .forEach((key) => {
                const index = keys.indexOf(key);

                if (index > -1) {
                    delete lifetime[key];
                }
            });

        this.setLifetime(lifetime);
    }

    private updateLifetime(key: string, lifetime: number) {
        const lifetimeAll = this.getLifetime();
        lifetimeAll[key] = Math.round(new Date().getTime() / 1000) + lifetime;
        this.setLifetime(lifetimeAll);
    }

    private setLifetime(lifetime: {[key: string]: number}) {
        this.gateway.set(Cache.LIFETIME_KEY, lifetime);
    }
}
