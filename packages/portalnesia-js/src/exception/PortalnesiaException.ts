import { ResponseData } from "../base";

export default class PortalnesiaError extends Error {
    code?: number|string;
    payload?: ResponseData<any>
    constructor(dt?:string|ResponseData<any>,name?:string,code?:number|string) {
        let msg="";
        if(typeof dt === 'string') {
            super(dt)
        } else {
            if(typeof dt?.error === 'boolean') {
                msg = dt?.message||"Something went wrong";
            } else {
                // @ts-ignore
                msg = dt?.error?.description||dt?.error_description||"Something went wrong"
            }
            super(msg)
            this.payload = dt;
        }
        this.name= name ? `[PortalnesiaError] ${name}` : typeof dt !== 'string' && dt?.error?.name ? `[PortalnesiaError] ${dt?.error?.name}` : typeof dt !== 'string' && typeof dt?.error == 'string' ? `[PortalnesiaError] ${dt?.error}` : "PortalnesiaError";
        this.code = code ? code : typeof dt !== 'string' && dt?.error?.code ? dt?.error?.code : undefined;
    }
}