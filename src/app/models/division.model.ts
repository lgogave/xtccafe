export class Division{
  constructor(
    public id:string,
    public name:string
  ){}
}

export class ClientStatus{
  constructor(
    public id:string,
    public status:string
  ){}
}

export class MachineDetail{
  constructor(
    public id:string,
    public name:string,
    public group:number,
    public srno:number,
    public ref?:string,
  ){}
}

export class MastStock{
  constructor(
    public id:string,
    public item:string,
    public uom?:string,
    public hsnNo?:string,
    public gst?:string,
    public category?:string,
    public rate?:string,
  ){}
}
export class MastInstallKit{
  constructor(
    public id:string,
    public item:string,
  ){}
}
export class MastBranch{
  constructor(
    public id:string,
    public name:string,
    public address:string,
    public gstno:string,
    public isActive:string,
    public state:string,
    public code:string,
    public cin:string,
    public bankName:string,
    public accNo:string,
    public branchifscode:string,
    public pan:string,
    public initials:string,
  ){}
}




