import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Division,ClientStatus, MachineDetail, MastStock, MastInstallKit, MastBranch } from '../models/division.model';
import { BillingDetail, InvoiceBank } from '../salespipeline/salespipeline.model';

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  private _divisions = new BehaviorSubject<Division[]>([]);
  private _statuses = new BehaviorSubject<ClientStatus[]>([]);
  constructor(
    private authService: AuthService,
    private firebaseService: AngularFirestore
  ) {}
  get divisions() {
    return this._divisions.asObservable();
  }
  get clientStatus() {
    return this._statuses.asObservable();
  }

  fetchDivisions() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('User not found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.firebaseService
          .collection('division',ref=>ref.orderBy('name'))
          .valueChanges()
          .pipe(
            map((divisions) => {
              return divisions.map((division) => {
                return <Division>{ ...(division as {}) };
              });
            }),
            tap((divisions) => {
              this._divisions.next(divisions);
            })
          );
      })
    );
  }

  async getClientStatusList(): Promise<any> {
    const clientList = await this.firebaseService
    .collection('client-status',ref=>ref.orderBy('status'))
      .valueChanges().pipe(first()).toPromise();
    return clientList as ClientStatus[];
  }

  async getMachineDetailList(): Promise<any> {
    const clientList = await this.firebaseService
    .collection('machine-detail')
      .valueChanges().pipe(first()).toPromise();
    return clientList as MachineDetail[];
  }
  async getStock(): Promise<any> {
    const result = await this.firebaseService
    .collection('master-stock')
      .valueChanges().pipe(first()).toPromise();
    return result as MastStock[];
  }
  async getBanks(): Promise<any> {
    const result = await this.firebaseService
    .collection('invoice-bank')
      .valueChanges().pipe(first()).toPromise();
    return result as InvoiceBank[];
  }
  async getInstallKits(): Promise<any> {
    const result = await this.firebaseService
    .collection('master-install-kit')
      .valueChanges().pipe(first()).toPromise();
    return result as MastInstallKit[];
  }

  async getBranches(): Promise<any> {
    const result = await this.firebaseService
    .collection('branches',ref=>ref.orderBy("name"))
      .valueChanges().pipe(first()).toPromise();
    return result as MastBranch[];
  }
  async getBrancheByName(name:string): Promise<any> {
    const result = await this.firebaseService
    .collection('branches',ref=>ref.where("name","==",name))
      .valueChanges().pipe(first()).toPromise();
    return result as MastBranch[];
  }


}

