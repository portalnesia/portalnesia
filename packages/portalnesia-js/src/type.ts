import { AxiosRequestConfig } from "axios";

export interface PortalnesiaOptions {
    client_id: string;
    client_secret?: string;
    axios?: AxiosRequestConfig;
    version?: number;
}

export type ISeen = {
    number: number,
    format: string
}

export type IDate = {
    format:string,
    timestamp: number
} | null

export type ApiErrorTypes = {
    name: string,
    code: number,
    description: string
}

export interface ResponseData<R> {
    error: ApiErrorTypes,
    data: R;
    message: string;
    token?: string;
}

export type ResponsePagination<D> = {
    page: number,
    total_page: number,
    can_load:boolean,
    total: number,
    data: D[]
}