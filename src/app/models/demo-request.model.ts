import { MachineDetail, MastStock } from "./division.model";

export class DemoRequest{
  constructor(
    public id:number,
    public userId:string,
    public createdOn:Date,
    public reqStatus:string,
    public salespipelineId:string,
    public orgName?:string,
    public orgStatus?:string,
    public address?:string,
    public addLocation?:string,
    public addPincode?:string,
    public addState?:string,
    public conName?:string,
    public conMobile?:string,
    public conEmail?:string,
    public accInstallation?:string[],
    public accOther?:string,
    public instDemo?:string,
    public dateDelivery?:Date,
    public dateDemo?:Date,
    public dateEndDemo?:Date,
    public datePickup?:Date,
    public satGSTNo?:string,
    public satSEZ?:string,
    public satBranch?:string,
    public cnsNoEmp?:string,
    public cnsNoCups?:string,
    public approverComment?:string,
    public approverUserId?:string,
    public approverUserName?:string,
    public approverDate?:Date,
    public machineDetails?:MachineDetail[],
    public materialDetails?:MastStock[]
  ){}
}

export class DemoRequestViewModel{
  constructor(
    public id:number,
    public userId:string,
    public createdOn:Date,
    public reqStatus:string,
    public orgName?:string,
    public orgStatus?:string,
    public address?:string,
    public addLocation?:string,
    public dateDemo?:Date,
    public docId?:string,
    public approverComment?:string,
    public approverUserId?:string,
    public approverUserName?:string,
    public approverDate?:Date,
    public satSEZ?:string,
    public satBranch?:string,
  ){}
}
