
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
    public branch?: string,
    public materialDetails?:any,
    public date?: Date,
    public month?: string,
    public createdOn?: Date,
    public userId?: string,
    public isEntyDeleted?: boolean,
    public branchFrom?: string,
    public refId?: string,
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


