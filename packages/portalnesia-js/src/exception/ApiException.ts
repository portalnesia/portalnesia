import { ResponseData } from "@src/api/base";

export default class CatchApiError extends Error {
  code?: number|string;
  payload?: ResponseData<any>
  constructor(dt: ResponseData<any>) {
      let msg="";
      if(typeof dt?.error === 'boolean') {
          msg = dt?.message||"Something went wrong";
      } else {
          msg = dt?.error?.description||"Something went wrong"
      }
      super(msg);
      if(typeof dt?.error?.code !== 'undefined') {
          this.code=dt?.error?.code||500;
      }
      this.name=dt?.error?.name||"Server Error";
      this.payload = dt;
  }
}