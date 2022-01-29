export default class PortalnesiaError extends Error {
    code?: number|string;
    constructor(msg?:string,name?:string,code?:number|string) {
        super(msg);
        this.name= name ? `[PortalnesiaError] ${name}` : "PortalnesiaError";
        this.code = code;
    }
}