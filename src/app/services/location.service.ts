import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Location } from '../models/Location.model';
@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private _locations = new BehaviorSubject<Location[]>([]);
  constructor(
    private authService: AuthService,
    private firebaseService: AngularFirestore
  ) {}
  get locations() {
    return this._locations.asObservable();
  }
  fetchLocations() {
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
          .collection('location')
          .valueChanges()
          .pipe(
            map((locations) => {
              return locations.map((location) => {
                return <Location>{ ...(location as {}) };
              });
            }),
            tap((locations) => {
              this._locations.next(locations);
            })
          );
      })
    );
  }
}
