export class UserNotification{
  constructor(
    public userId:string,
    public deviceToken :string,
    public createdOn :Date
  ){}
}
