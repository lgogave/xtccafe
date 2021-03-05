import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Potentialnature } from '../models/Potentialnature.model';

@Injectable({
  providedIn: 'root',
})
export class PotentialnatureService {
  private _potentialnatures = new BehaviorSubject<Potentialnature[]>([]);
  constructor(
    private authService: AuthService,
    private firebaseService: AngularFirestore
  ) {}
  get potentialnatures() {
    return this._potentialnatures.asObservable();
  }

  fetchPotentialnatures() {
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
          .collection('potential-nature',ref=>ref.orderBy('name'))
          .valueChanges()
          .pipe(
            map((Potentialnatures) => {
              return Potentialnatures.map((Potentialnature) => {
                return <Potentialnature>{ ...(Potentialnature as {}) };
              });
            }),
            tap((Potentialnatures) => {
              this._potentialnatures.next(Potentialnatures);
            })
          );
      })
    );
  }
}
