export interface IGateway {
    getKeys(): string[];

    get(key: string);

    set(key: string, value: any);

    remove(key: string);

    clear();
}