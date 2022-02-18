import { ResponseData } from "@src/api/base";

export default class CatchApiError extends Error {
  code?: number|string;
  constructor(dt: ResponseData<any>) {
      let msg="";
      if(typeof dt?.error === 'boolean') {
          msg = dt?.message;
      } else {
          msg = dt?.error?.description
      }
      super(msg);
      if(typeof dt?.error?.code !== 'undefined') {
          this.code=dt?.error?.code;
      }
      this.name=dt?.error?.name;
  }
}