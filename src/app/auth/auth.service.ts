import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject,from } from 'rxjs';
import { map,switchMap,take,tap } from 'rxjs/operators';
import { User } from './user.model';
import {Plugins} from '@capacitor/core'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { rejects } from 'assert';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
  uid: string;
  roles:string[];
  name:string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private _activeLogoutTime: any;
  private _appuser:User = new User(null,null,null,null,null,null);

  constructor(
    private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private firebaseService: AngularFirestore
  ) {}

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          token: string;
          tokenExpirationDate: string;
          email: string;
          roles: string[];
          name: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        // if (expirationTime <= new Date()) {
        //   return null;
        // }



        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime,
          parsedData.roles,
          parsedData.name
        );
        this._appuser.id=user.id;
        this._appuser.email=user.email;
        this._appuser.name=user.name;
        this._appuser.roles=user.roles;
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  get userIsAutheticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }
  get userRoles() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.roles;
        } else {
          return null;
        }
      })
    );
  }
  get isAdmin() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          if (user.roles && user.roles.filter((u) => u == 'admin').length > 0) {
            return true;
          }
        } else {
          return false;
        }
      })
    );
  }
  get userdetail() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return {
            isAutheticated: !!user.token,
            name: user.name,
            roles: user.roles,
          };
        } else {
          return { isAutheticated: false, name: '' };
        }
      })
    );
  }
  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }
  get userName() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.name;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }
  get appuserId(){
    return this._appuser.id;
  }
  // login_old(email: string, password: string) {
  //   this.firebaseAuth.signInWithEmailAndPassword(email,password).then(value=>{}).catch(err=>{});
  //   return this.http
  //     .post<AuthResponseData>(
  //       `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
  //       { email: email, password: password, returnSecureToken: true }
  //     )
  //     .pipe(tap(this.setUserData.bind(this)));
  //   //this._userIsAutheticated = true;
  // }
  login_new(email: string, password: string){
    console.log("********Auth start**********")
    var auth=this.firebaseAuth
    .signInWithEmailAndPassword(email, password).then(res=>{
      console.log(res.user)
      return <AuthResponseData>(res.user as {});
    }).catch((err) => {
      throw err;
    }) as Promise<AuthResponseData>;
    console.log("********Auth End**********")
    }
  login(email: string, password: string) {
    var userAuthData: AuthResponseData;
    return from(
      this.firebaseAuth
        .signInWithEmailAndPassword(email, password)
        .then((value) => {
          return <AuthResponseData>(value.user as {});
        })
        .catch((err) => {
          throw err;
        }) as Promise<AuthResponseData>
    ).pipe(
      tap((user) => {
        userAuthData = user;
        return user;
      }),
      take(1),
      switchMap((user) => {
        return this.firebaseService
          .collection('user-roles', (ref) =>
            ref.where('userId', '==', user.uid)
          )
          .valueChanges();
      }),
      take(1),
      map((userrole) => {
        userAuthData.roles = userrole[0]['roles'];
        userAuthData.name = userrole[0]['name'];
        this.setUserData(userAuthData);
        return userAuthData;
        //return this.setUserData.bind(userAuthData);
      })
    );
  }




  logout() {
    if (this._activeLogoutTime) {
      clearTimeout(this._activeLogoutTime);
    }
    this._appuser=new User(null,null,null,null,null,null);
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
    this.firebaseAuth.signOut();

  }

  private autoLogout(duration: number) {
    return true;
    if (this._activeLogoutTime) {
      clearTimeout(this._activeLogoutTime);
    }
    this._activeLogoutTime = setTimeout(() => {
      this.logout();
    }, duration);
  }
  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }
  setUserData(userData: AuthResponseData) {
    this._appuser.id=userData.uid;
    this._appuser.email=userData.email;
    this._appuser.name=userData.name;
    this._appuser.roles=userData.roles;
    /*const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );
    */
    const expirationTime = new Date(new Date().getTime() + 9600 * 1000);
    const user = new User(
      userData.uid,
      userData.email,
      userData.refreshToken,
      expirationTime,
      userData.roles,
      userData.name
    );

    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.uid,
      userData.refreshToken,
      expirationTime.toISOString(),
      userData.email,
      userData.roles,
      userData.name
    );
  }

  storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    roles: string[],
    name: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email,
      roles: roles,
      name: name,
    });
    Plugins.Storage.set({ key: 'authData', value: data });
    console.log('login called at' + new Date());
  }

  ngOnDestroy() {
    if (this._activeLogoutTime) {
      clearTimeout(this._activeLogoutTime);
    }
  }
}
