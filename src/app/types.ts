export interface Agent {
    id: number;
    name: string;
    os: OS;
    created_datetime: string;
    last_connected_datetime: string;
    tags: string[];
    group: string;
    connected: boolean;
    authorization_status: AuthStatus;
}

export type IAddAgent = Omit<
    Agent,
    | 'id'
    | 'created_datetime'
    | 'last_connected_datetime'
    | 'connected'
    | 'authorization_status'
>;

export interface IOptions {
    page: number;
    pageSize: number;
    offset: number;
    filters: Record<string, string[] | string | boolean | number>;
    sort: { field: string; order: 'asc' | 'desc' };
}

export enum OS {
    Windows = 'windows',
    Linux = 'linux',
    Macos = 'macos'
}

export enum AuthStatus {
    Authorized = 'authorized',
    Unauthorized = 'unauthorized'
}
