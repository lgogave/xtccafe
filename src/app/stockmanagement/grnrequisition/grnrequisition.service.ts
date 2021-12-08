import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, observable, of } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import type firebase from 'firebase';
import { GRNRequistionRequest } from './grnrequisition.model';

@Injectable({
  providedIn: 'root',
})
export class GrnrequisitionService {
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
          .collection('grn-request')
          .add(Object.assign({}, porequest)).then(res=>res.id);
        }
        else{
          return this.firebaseService
          .collection('grn-request').doc(porequest.id)
          .update(Object.assign({}, porequest)).then(res=>porequest.id);
        }
      }),
      map((doc) => {
        return doc;
      }),
      take(1)
    );
  }


  async getById(id: string): Promise<any> {
      let snaps = await this.firebaseService
      .collection('grn-request').doc(id).get().toPromise();
      var result = <GRNRequistionRequest>{
        ...(snaps.data() as {}),
      };
      result.id = snaps.id;
    return result;
  }
  async getByPOId(poId: string): Promise<any> {
    let snaps = await this.firebaseService
    .collection('grn-request', (ref) =>
    ref.where('poId', '==', poId)
  ).get().toPromise();

  const result = snaps.docs.map((doc) => {
    let obj=<GRNRequistionRequest>{...doc.data() as {} }
    obj.id=doc.id
    return obj;
  })
  return result;
  }
  async getAll(): Promise<GRNRequistionRequest[]> {
    let snaps:any;
      snaps= await this.firebaseService
      .collection('grn-request', (ref) =>
        ref.orderBy('createdOn','desc'))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
    let dcdetail:GRNRequistionRequest[];
    dcdetail=snaps.map((billDetail) => {
        var sl = <GRNRequistionRequest>{
          ...(billDetail.payload.doc.data() as {}),
        };
        sl.id = billDetail.payload.doc.id;
        return sl;
      });
      return dcdetail;
  }
}
