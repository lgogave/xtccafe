export class Client {
  constructor(
    public id: string,
    public name: string,
    public contactPerson: string,
    public contactNumber: number,
    public email: string,
    public potentialNature: string,
    public accountOwner: string,
    public userId: string,
    public group: string,
    public gstNumber: string,
    public employeeStrength: string,
    public potentialNatureId: string,
    public country:string,
    public region:string,
    public subRegion:string,
    public state:string,
    public city:string,
    public locationId:string,
    public updatedOn:Date,
    public divisionIds?: string[],
    public divisions?: string[],
    public clientTypeIds?: string[],
    public clientTypes?: string[],

    ) {}
}
