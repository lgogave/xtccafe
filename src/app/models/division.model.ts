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
  ){}
}
export class MastInstallKit{
  constructor(
    public id:string,
    public item:string,
  ){}
}



