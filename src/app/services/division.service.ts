import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Division } from '../models/division.model';

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  private _divisions = new BehaviorSubject<Division[]>([]);
  constructor(
    private authService: AuthService,
    private firebaseService: AngularFirestore
  ) {}
  get divisions() {
    return this._divisions.asObservable();
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
}
