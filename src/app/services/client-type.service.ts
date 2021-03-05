import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { ClientType } from '../models/clientType.model';

@Injectable({
  providedIn: 'root',
})
export class ClientTypeService {
  private _clientTypes = new BehaviorSubject<ClientType[]>([]);
  constructor(
    private authService: AuthService,
    private firebaseService: AngularFirestore
  ) {}
  get clientTypes() {
    return this._clientTypes.asObservable();
  }

  fetchclientTypes() {
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
          .collection('clientType',ref=>ref.orderBy('name'))
          .valueChanges()
          .pipe(
            map((clientTypes) => {
              return clientTypes.map((clientType) => {
                return <ClientType>{ ...(clientType as {}) };
              });
            }),
            tap((clientTypes) => {
              this._clientTypes.next(clientTypes);
            })
          );
      })
    );
  }
}
