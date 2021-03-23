export class ClientUser{
  constructor(
    public id:string,
    public name:string
  ){}
}

export class ClientUserAccess{
  constructor(
    public clientId:string,
    public isActive:boolean,
    public updatedOn:Date,
    public userId:string,
  ){}
}
