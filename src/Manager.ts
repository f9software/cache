import {ICache} from "./Cache";

export class Manager {
    public static setInterval(seconds: number) {
        Manager.interval = seconds * 1000;

        if (Manager.started) {
            Manager.stop();
            Manager.start();
        }
    }

    public static start() {
        if (Manager.started) {
            return;
        }

        Manager.started = true;
        Manager.intervalId = setInterval(Manager.validateAll, Manager.interval);
    }

    public static stop() {
        if (!Manager.started) {
            return;
        }

        Manager.started = false;
        clearInterval(Manager.intervalId);
        Manager.intervalId = null;
    }

    public static register(cache: ICache) {
        Manager.all.push(cache);

        if (!Manager.started) {
            Manager.start();
        }
    }

    public static unregister(cache: ICache) {
        const all = Manager.all;
        const index = all.indexOf(cache);

        if (index > -1) {
            all.splice(index, 1);
        }
    }

    public static validate(cache: ICache) {
        const lifetime = cache.getLifetime();
        const remove = [];

        Object.keys(lifetime)
            .forEach(
                (key) => {
                    if (lifetime[key] <= Manager.now) {
                        remove.push(key);
                    }
                },
            );

        if (remove.length > 0) {
            cache.removeMany(remove);
        }
    }

    private static all: ICache[] = [];

    private static started: boolean = false;

    private static intervalId: number;

    private static now: number;

    private static interval: number = 15000;

    private static validateAll() {
        Manager.now = Math.round(new Date().getTime() / 1000);
        Manager.all.forEach(Manager.validate);
        Manager.now = null;
    }
}
