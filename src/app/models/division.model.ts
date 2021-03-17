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
