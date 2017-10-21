export interface IGateway {
    get(key: string);

    set(key: string, value: any);

    remove(key: string);

    clear();
}