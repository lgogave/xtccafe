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