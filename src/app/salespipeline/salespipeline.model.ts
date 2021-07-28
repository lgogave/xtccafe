import { Client } from "../clients/client.model";
import { MachineDetail } from "../models/division.model";

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
      public machinehsncode?: number,
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
    public deviceToken?:string,
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
    public id?: string,
    public branch?: string,
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
    public taxType?:string,
    public materialDetails?:BillingRate[],
    public userId?:string,
    public createdOn?:Date,
    public pincode?:number,
    public bank?:InvoiceBank
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

export class DCDetailModel {
  constructor(
    public id?:string,
    public srNo?:string,
    public clientId?:string,
    public salesId?:string,
    public locationId?:string,
    public billName?:string,
    public billAddress?:string,
    public location?:string,
    public address?:string,
    public pincode?:string,
    public branch?:string,
    public gstno?:string,
    public date?:Date,
    public materialDetails?:DCMaterial[],
    public materialAddhoc?:DCAddHocMaterial[],
    public userId?:string,
    public createdOn?:Date,
    public type?:string,
    public isSelected:boolean=false,
    public isUsed:boolean=false,
    ){}
}

export class DCDetail {
  constructor(
    public id?:string,
    public srNo?:string,
    public clientId?:string,
    public salesId?:string,
    public locationId?:string,
    public billName?:string,
    public billAddress?:string,
    public location?:string,
    public installAt?:string,
    public address?:string,
    public pincode?:string,
    public branch?:string,
    public gstno?:string,
    public date?:Date,
    public materialDetails?:DCMaterial[],
    public materialAddhoc?:DCAddHocMaterial[],
    public userId?:string,
    public createdOn?:Date,
    public isUsed?:boolean,
    public isDelete?:boolean
    ){}
}

export class InstallDCDetail {
  constructor(
    public id?:string,
    public type?:Number,
    public srNo?:string,
    public clientId?:string,
    public salesId?:string,
    public locationId?:string,
    public billName?:string,
    public billAddress?:string,
    public location?:string,
    public installAt?:string,
    public address?:string,
    public pincode?:string,
    public branch?:string,
    public gstno?:string,
    public date?:Date,
    public machineDetails?:Machine[],
    public userId?:string,
    public createdOn?:Date,
    public isUsed?:boolean,
    public isDelete?:boolean
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
    public rate?:number,
    public amount?:number,
    public tax?:number,
    public totamount?:number,
    ){}
}
export class DCAddHocMaterial {
  constructor(
    public item?:string,
    public price?:number
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
      public mchRent?: number,
      public consumableCap?: number,
      public mchInstCharges?: number,
      public mchSecDeposite?: number,
      public isInstChargesConsider?: boolean,
      public machinehsncode?: boolean,
      public pulloutDate?: Date,
  ) {}
}

export class InvoiceMonth{
  constructor(public id?:string,public month?:Date,public displaymonth?:string){}
}

export class Invoice{
constructor(
  public id?:string,
  public srNo?:string,
  public bank?:InvoiceBank,
  public branch?:string,
  public month?:Date,
  public status?:string,
  public displaymonth?:string,
  public clientId?:string,
  public clientLocationId?:string,
  public clientName?:string,
  public clientLocation?:string,
  public taxType?:string,
  public amount?:number,
  public tax?:number,
  public totamount?:number,
  public dcIds?:string[],
  public dc?:DCDetailModel[],
  public machines?:Machine[],
  public mchRent?:number,
  public mchdeposite?:number,
  public mchinstCharges?:number,
  public consumableCap?:number,
  public userId?:string,
  public ponumber?:string,
  public createdOn?:Date,
  public billName?:string,
  public billAddress?:string,
  public installAt?:string,
  public installAddress?:string,
){}
}

export class RentalInvoice{
  constructor(
    public id?:string,
    public srNo?:string,
    public bank?:InvoiceBank,
    public branch?:string,
    public month?:Date,
    public status?:string,
    public displaymonth?:string,
    public clientId?:string,
    public clientLocationId?:string,
    public clientName?:string,
    public clientLocation?:string,
    public taxType?:string,
    public machines?:Machine[],
    public mchRent?:number,
    public mchdeposite?:number,
    public mchinstCharges?:number,
    public consumableCap?:number,
    public userId?:string,
    public createdOn?:Date,
    public billName?:string,
    public billAddress?:string,
    public installAt?:string,
    public installAddress?:string){}
  }

export class ReceiptBook{
  constructor(
    public id?:string,
    public category?:string,
    public type?:string,
    public branch?:string,
    public year?:number,
    public srnumber?:number,
    public userId?:string,
    public createdOn?:Date){}
  }


export class InvoiceBank {
  constructor(
    public id?: string,
    public name?: string,
    public branch?: string,
    public address?: string,
    public ifsc?: string,
    public accno?: string,
  ) {}
}

export class InvoiceModel{
  constructor(
    public ponumber?: string,
    public rent?: number,
    public billName?:string,
    public billAddress?:string,
    public installAt?:string,
    public installAddress?:string,
  ){}
}






