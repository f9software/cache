export interface IGateway {
    getKeys(): string[];

    get(key: string): any;

    set(key: string, value: any): void;

    remove(key: string): void;

    clear(): void;
}
