import {IGateway} from "./Gateway";

export class LocalStorageGateway implements IGateway {
    private ls;

    constructor(private id: string) {
        this.ls = window.localStorage;
    }

    private key(key: string) {
        return '#' + this.id + '#' + key;
    }

    getKeys(): string[] {
        const match = this.key('');
        return Object.keys(localStorage).filter(key => key.indexOf(match) === 0);
    }

    get(key: string) {
        return JSON.parse(this.ls.getItem(this.key(key)));
    }

    set(key: string, value) {
        this.ls.setItem(this.key(key), JSON.stringify(value));
    }

    remove(key: string) {
        this.ls.removeItem(this.key(key));
    }

    clear() {
        const partialKey = this.key('');

        Object.keys(this.ls)
            .forEach(
                key => {
                    if (key.indexOf(partialKey) === 0) {
                        this.ls.removeItem(key);
                    }
                }
            )
    }
}
