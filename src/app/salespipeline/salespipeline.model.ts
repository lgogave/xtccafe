import { Client } from "../clients/client.model";

  export class SalesPipeline {
    constructor(
      public id?: string,
      public group?: string,
      public clientId?: string,
      public client?: string,
      public comment?: string,
      public city?: string,
      public address?: string,
      public installAt?: string,
      public installAddress?: string,
      public currentStatus?: string,
      public closureDate?: Date,
      public machineName?: string,
      public machineType?: string,
      public machineCategory?: string,
      public machineCount?: string,
      public machineSrNo?: string,
      public rate?: string,
      public mhamount?: number,
      public locamount?: number,
      public clientamount?: number,
      public userId?: string,
      public updatedOn?: Date,
      public machineConflevel?: number,
    ) {}
  }
  export class ClientSales {
        constructor(
          public clientsale?:ClientSalesPipeline,
          public client?:Client
        ) {}
}


export class ClientComment {
  constructor(
    public saleId?:string,
    public comment?:string,
    public undatedOn?:Date,
    public userId?:string,
  ) {}
}

export class ClientCommentModel {
  constructor(
    public saleId?:string,
    public comment?:string,
    public undatedOn?:Date,
    public userId?:string,
    public user?:User,
  ) {}
}

export class User {
  constructor(
    public name?:string,
    public userId?:string,
    public role?:string[],
    public isActive?:boolean,
  ) {}
}


export class ClientSalesPipeline {
  constructor(
    public id?: string,
    public group?: string,
    public clientId?: string,
    public client?: string,
    public comment?: string,
    public userId?: string,
    public updatedOn?: Date,
    public amount?: number,
    public locations?:Location[],
    public action?:string,
    public billingAmount?: number,
    public machineCount?: number,
  ) {}
}
export class Location {
  constructor(
    public city?: string,
    public address?: string,
    public installAt?: string,
    public installAddress?: string,
    public currentStatus?: string,
    public closureDate?: Date,
    public amount?: number,
    public machines?:Machine[],
    public billingAmount?: number,
    public machineCount?: number,
    public id?: string
  ) {}
}
export class BillingDetail {
  constructor(
    public id?:string,
    public clientId?:string,
    public salesId?:string,
    public locationId?:string,
    public billName?:string,
    public billAddress?:string,
    public location?:string,
    public installAt?:string,
    public installAddress?:string,
    public gstno?:string,
    public materialDetails?:BillingRate[],
    public userId?:string,
    public createdOn?:Date
    ){}
}
export class BillingRate {
  constructor(
    public category?:string,
    public item?:string,
    public hsnNo?:string,
    public gst?:string,
    public uom?:string,
    public price?:number,
    ){}
}

export class DCDetail {
  constructor(
    public id?:string,
    public clientId?:string,
    public salesId?:string,
    public locationId?:string,
    public salesLocId?:string,
    public billName?:string,
    public billAddress?:string,
    public location?:string,
    public address?:string,
    public pincode?:string,
    public branch?:string,
    public gstno?:string,
    public date?:Date,
    public materialDetails?:DCMaterial[],
    public userId?:string,
    public createdOn?:Date
    ){}
}
export class DCMaterial {
  constructor(
    public category?:string,
    public item?:string,
    public hsnNo?:string,
    public gst?:string,
    public uom?:string,
    public qty?:number,
    ){}
}





export class Machine {
  constructor(
    public machineName?: string,
      public machineType?: string,
      public machineCategory?: string,
      public machineCount?: number,
      public machineSrNo?: string,
      public rate?: number,
      public amount?: number,
      public conflevel?: number,
      public billingAmount?: number,
  ) {}
}





