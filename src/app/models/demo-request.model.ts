export class DemoRequest{
  constructor(
    public id:string,
    public createdBy:string,
    public createdOn:Date,
    public reqStatus:string,

    public orgName?:string,
    public orgStatus?:string,

    public address?:string,
    public addLocation?:string,
    public addPincode?:string,
    public addState?:string,

    public billAddress?:string,
    public billLocation?:string,
    public billPincode?:string,
    public billState?:string,

    public delAddress?:string,
    public delLocation?:string,
    public delPincode?:string,
    public delState?:string,

    public conName?:string,
    public conMobile?:string,
    public conLandline?:string,
    public conEmail?:string,
    public conRef?:string,

    public mchModel?:string,
    public mchNoMachine?:string,
    public mchType?:string,

    public accInstallation?:string,
    public accOther?:string,

    public installation?:string,
    public instDemo?:string,

    public rate?:number,
    public rategst?:number,
    public rateamount?:number,


    public rentTerm?:string,
    public rentRateMonth?:number,
    public rentamount?:number,


    public depApplicable?:string,
    public depAmount?:number,

    public payTerms?:string,
    public payCreditPeriod?:string,
    public payCreditLimit?:string,
    public payModel?:string,

    public comApplicable?:string,
    public comQuantity?:string,
    public comTerm?:string,

    public dateDelivery?:Date,
    public dateInstallation?:Date,
    public dateDemo?:Date,
    public dateNoDays?:string,
    public datePickup?:Date,
    public dateDeliveryAsPer?:string,
    public dateDeliveryCharge?:string,



    public satPANNo?:string,
    public satGSTNo?:string,
    public satSEZ?:string,


    public bankAccName?:string,
    public bankAddress?:string,
    public bankAccNo?:string,
    public bankBranch?:string,
    public bankIFSCCode?:string,

    public instaRequirement?:string,

    public cnsNoEmp?:string,
    public cnsNoCups?:string,

    public manApplicable?:string,
    public manNoOfManpower?:string,
    public manTerms?:string,
    public manRateTax?:number,

    public matDelivery?:string,
    public matBilling?:string,
    public matBillType?:string,
    public matStatutory?:string,

    public subBillType?:string,
    public submission?:string,
    public subMethod?:string,
    public subDocs?:string,
    public subDueDate?:Date,

    public outML?:string,
    public outGrammage?:string,

    public billBranch?:string,


    public detXTCoffeeQty?:string,
    public detXTCoffeeUOM?:string,
    public detXTCoffeeRate?:string,

    public detSugarQty?:string,
    public detSugarUOM?:string,
    public detSugarRate?:string,

    public detTeaBagsQty?:string,
    public detTeaBagsUOM?:string,
    public detTeaBagsRate?:string,

    public detTeaBlendQty?:string,
    public detTeaBlendUOM?:string,
    public detTeaBlendRate?:string,

    public detFilCoffeeQty?:string,
    public detFilCoffeeUOM?:string,
    public detFilCoffeeRate?:string,

    public detStirrerQty?:string,
    public detStirrerUOM?:string,
    public detStirrerRate?:string,

    public detPaperCupsQty?:string,
    public detPaperCupsUOM?:string,
    public detPaperCupsRate?:string,
  ){}
}
