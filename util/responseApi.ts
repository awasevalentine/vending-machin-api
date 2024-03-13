/* eslint-disable prettier/prettier */
export class ApiResponse<T> {
    responseCode: string;
    responseDescription: string;
    data: T;
  
    constructor( respCode = '', respDescr = '', respData: T = null) {
      this.responseCode = respCode;
      this.responseDescription = respDescr;
      this.data = respData;
    }
  }
  