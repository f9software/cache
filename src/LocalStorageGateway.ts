import {IGateway} from "./Gateway";

export class LocalStorageGateway implements IGateway {
    private ls;

    private regex: RegExp;

    constructor(private id: string) {
        this.ls = window.localStorage;
        this.regex = new RegExp(this.key('') + '(.*)');
    }

    private key(key: string) {
        return '#' + this.id + '#' + key;
    }

    /**
     * It returns the keys that this gateway is working with. It does not return other localStorage keys.
     * @returns {string[]}
     */
    getKeys(): string[] {
        return Object.keys(localStorage)
            .map(key => {
                const match = key.match(this.regex);
                if (match !== null) {
                    return match[1];
                }

                return null;
            })
            .filter(key => key !== null);
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
