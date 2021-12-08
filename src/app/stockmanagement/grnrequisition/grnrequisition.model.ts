export class GRNRequistionRequest {
  constructor(
    public id?:string,
    public poId?:string,
    public srNo?:string,
    public date?:Date,
    public status?:string,
    public vendor?:string,
    public materialDetails?:GRNMaterial[],
    public userId?:string,
    public createdOn?:Date,
    public isDelete?:boolean,
    ){}
}
export class GRNMaterial {
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
    public actQtyRecived?:number,
    ){}
}