export interface IGateway {
    get(key: string);

    set(key: string, value: any);

    clear();
}