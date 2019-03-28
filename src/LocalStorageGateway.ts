import {IGateway} from "./Gateway";

export class LocalStorageGateway implements IGateway {
    private ls: Storage = window.localStorage;

    private regex: RegExp = new RegExp(this.key("") + "(.*)");

    public constructor(private id: string) {}

    /**
     * It returns the keys that this gateway is working with. It does not return other localStorage keys.
     * @returns {string[]}
     */
    public getKeys(): string[] {
        const keys = Object.keys(localStorage)
            .map((key) => {
                const match = key.match(this.regex);
                if (match !== null) {
                    return match[1];
                }

                return null;
            })
            .filter((key) => key !== null);

        return keys as string[];
    }

    public get(key: string): any {
        return JSON.parse(this.ls.getItem(this.key(key)));
    }

    public set(key: string, value: any) {
        this.ls.setItem(this.key(key), JSON.stringify(value));
    }

    public remove(key: string) {
        this.ls.removeItem(this.key(key));
    }

    public clear() {
        const partialKey = this.key("");

        Object.keys(this.ls)
            .forEach(
                (key) => {
                    if (key.indexOf(partialKey) === 0) {
                        this.ls.removeItem(key);
                    }
                },
            );
    }

    private key(key: string): string {
        return "#" + this.id + "#" + key;
    }
}
