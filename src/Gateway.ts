export interface IGateway {
    getKeys(): string[];

    get(key: string): any;

    set(key: string, value: any): never;

    remove(key: string): never;

    clear(): never;
}
