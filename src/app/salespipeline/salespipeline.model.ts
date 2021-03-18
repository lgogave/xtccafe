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
      public currentStatus?: string,
      public closureDate?: Date,
      public machineName?: string,
      public machineType?: string,
      public machineCategory?: string,
      public machineCount?: string,
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
    public currentStatus?: string,
    public closureDate?: Date,
    public amount?: number,
    public machines?:Machine[],
    public billingAmount?: number,
    public machineCount?: number,
  ) {}
}
export class Machine {
  constructor(
    public machineName?: string,
      public machineType?: string,
      public machineCategory?: string,
      public machineCount?: number,
      public rate?: number,
      public amount?: number,
      public conflevel?: number,
      public billingAmount?: number,
  ) {}
}





