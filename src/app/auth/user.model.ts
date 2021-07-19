export class User {
    constructor(public id:string,public email:string,private _token:string,private tokenExpirationDate:Date,public roles:string[],public name:string,public deviceToken?:string){
    }

    get token(){
        if(!this.tokenExpirationDate || this.tokenExpirationDate<=new Date()){
          return null;
        }
        return this._token;
    }

    get tokenDuration(){
        if(!this.token){
            return 0;
        }
        return this.tokenExpirationDate.getTime()-new Date().getTime();

    }
}


export class UserRole {
  constructor(
    public userId: string,
    public name: string,
    public email: string,
    public roles: string[]
  ) {}
}
