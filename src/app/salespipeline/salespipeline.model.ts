export class Salespipeline {
    constructor(
      public id: string,
      public client: string,
      public brewer: string,
      public fm: string,
      public btoc: string,
      public preMix: string,
      public mtrl: string,
      public amount: number,
      public currentStatus: string,
      public potentialStatus: string,
      public closuredate: Date,
      public region: string,
      public location: string,
      public comments: string,
      public win: string,
      public value: string,
      public userId: string
    ) {}
  }


  export class SalesPipeline {
    constructor(
      public id?: string,
      public group?: string,
      public clientId?: string,
      public client?: string,
      public comment?: string,
      public city?: string,
      public address?: string,
      public currentStatus?: string,
      public closureDate?: Date,
      public machineName?: string,
      public machineType?: string,
      public machineCategory?: string,
      public machineCount?: string,
      public rate?: string,
      public userId?: string,
      public updatedOn?: Date
    ) {}

      }

  export class ClientSales {
        constructor(
          public clientId?: string,
          public client?: string,
          public comment?: string
        ) {}
}

export class ClientSalesPipeline {
  constructor(
    public id?: string,
    public group?: string,
    public clientId?: string,
    public client?: string,
    public comment?: string,
    public userId?: string,
    public updatedOn?: Date,
    public locations?:Location[],
  ) {}
}
export class Location {
  constructor(
    public city?: string,
    public address?: string,
    public currentStatus?: string,
    public closureDate?: Date,
    public machines?:Machine[]
  ) {}
}
export class Machine {
  constructor(
    public machineName?: string,
      public machineType?: string,
      public machineCategory?: string,
      public machineCount?: string,
      public rate?: string,
  ) {}
}





