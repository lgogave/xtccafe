import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { DemoRequest, DemoRequestViewModel } from '../models/demo-request.model';

@Injectable({
  providedIn: 'root'
})
export class DemoRequestService {
  private _demoRequest = new BehaviorSubject<DemoRequestViewModel[]>([]);

  constructor(
    private authService: AuthService,
    private firebaseService: AngularFirestore) {
  }

  get demoRequests() {
    return this._demoRequest.asObservable();
  }

  getDemoRequestById(demoId:string)
  {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId=userId;
      }),
      switchMap(()=>{
        return this.firebaseService.collection('demo-request').doc(demoId).valueChanges();
      }),
      map(request=>{
        return <DemoRequest> {...request as {}};
      })
    )

  }

  addDemoRequest(demoRequest:DemoRequest){
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId=userId;
      }),
      switchMap(()=>{
        demoRequest.userId=fetchedUserId;
        demoRequest.createdOn=new Date();
        return this.firebaseService
          .collection('demo-request')
          .add(Object.assign({}, demoRequest))
      }),
      switchMap(doc=>{
        return this.demoRequests;
      }),
      take(1),
      tap((request) => {
        let viewModel=<DemoRequestViewModel>demoRequest;
        this._demoRequest.next(request.concat(viewModel));
      })
    )
  }

  fetchDemoRequest(){
    let fetchedUserId: string;
    let isAdmin: boolean;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId=userId;
      }),
      switchMap(() => {
        return this.authService.isAdmin;
      }),
      map(isAdmin=>{
        isAdmin=isAdmin;
      }),
      switchMap(()=>{
        if(isAdmin)
        return this.firebaseService.collection('demo-request').snapshotChanges();
        else
        return this.firebaseService.collection('demo-request',ref=>ref.where('userId','==',fetchedUserId)).snapshotChanges();
      }),
      map(requests=>{
        return requests.map(req=>{
          let viewModel= <DemoRequestViewModel> {...req.payload.doc.data() as {}};
          viewModel.docId=req.payload.doc.id;
          return viewModel;
        })
      }),
      map(requests=>{
        this._demoRequest.next(requests);
      })
    )
  }
}
