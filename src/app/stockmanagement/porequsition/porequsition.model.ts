export class PORequistionRequest {
  constructor(
    public id?:string,
    public srNo?:string,
    public date?:Date,
    public poType?:string,
    public status?:string,
    public vendor?:string,
    public materialDetails?:POMaterial[],
    public userId?:string,
    public createdOn?:Date,
    public isDelete?:boolean,
    ){}
}
export class POMaterial {
  constructor(
    public id?:string,
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
    public branch?:string,
    public actQty?:number,
    ){}
}
