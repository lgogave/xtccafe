import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, observable, of } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import type firebase from 'firebase';
import { PORequistionRequest } from './porequsition.model';

@Injectable({
  providedIn: 'root',
})
export class PORequsitionService {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private firebaseService: AngularFirestore
  ) {}

  addupdate(porequest: any,isUpdate:boolean=false) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        porequest.userId = fetchedUserId;
        porequest.createdOn = new Date();
        if(!isUpdate){
          return this.firebaseService
          .collection('po-request')
          .add(Object.assign({}, porequest));
        }
        else{
          return this.firebaseService
          .collection('po-request').doc(porequest.id)
          .update(Object.assign({}, porequest));
        }
      }),
      map((doc) => {
        return doc;
      }),
      take(1)
    );
  }
  async updatebatch(prnrequest: any,isUpdate:boolean=false) {
    let batch=this.firebaseService.firestore.batch();
    const docRef= await this.firebaseService.firestore.collection('po-request').doc(prnrequest.id);
    batch.update(docRef,prnrequest);
    await batch.commit();
  }

  async getById(id: string): Promise<any> {
      let snaps = await this.firebaseService
      .collection('po-request').doc(id).get().toPromise();
      var result = <PORequistionRequest>{
        ...(snaps.data() as {}),
      };
      result.id = snaps.id;
    return result;
  }
  async getAll(): Promise<PORequistionRequest[]> {
    let snaps:any;
      snaps= await this.firebaseService
      .collection('po-request', (ref) =>
        ref.orderBy('createdOn','desc'))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
    let dcdetail:PORequistionRequest[];
    dcdetail=snaps.map((billDetail) => {
        var sl = <PORequistionRequest>{
          ...(billDetail.payload.doc.data() as {}),
        };
        sl.id = billDetail.payload.doc.id;
        return sl;
      });
      return dcdetail;
    }
}
