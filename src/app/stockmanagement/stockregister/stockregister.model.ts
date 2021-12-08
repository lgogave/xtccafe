
export enum EntryType {
  Credit,
  Debit
}
export class StockRegister {
  constructor(
    public id?: string,
    public sourceName?: string,
    public sourceId?: string,
    public entryType?: EntryType,
    public category?: string,
    public item?: string,
    public hsnNo?: string,
    public gst?: string,
    public uom?: string,
    public qty?: number,
    public rate?: number,
    public amount?: number,
    public tax?: number,
    public totamount?: number,
    public branch?: string,
    public materialDetails?:any,
    public actQty?: number,
    public date?: Date,
    public month?: string,
    public createdOn?: Date,
    public userId?: string,
    public isEntyDeleted?: boolean,

  ) {}
}
export class BranchStockRegister {
  constructor(
    public branch?: string,
    public materialDetails?:StockMaterial[]
  ){}
}
export class StockMaterial {
  constructor(
    public category?:string,
    public item?:string,
    public qty?:number,
  ){}
}


