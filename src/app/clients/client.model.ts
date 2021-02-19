export class Client {
  constructor(
    public id: string,
    public name: string,
    public type: string,
    public contactPerson: string,
    public contactNumber: number,
    public email: string,
    public potentialNature: string,
    public accountOwner: string,
    public userId: string
  ) {}
}