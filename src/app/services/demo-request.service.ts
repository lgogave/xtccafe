import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { DemoRequest, DemoRequestViewModel } from '../models/demo-request.model';
import { UserRole } from '../auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class DemoRequestService {
  private _demoRequest = new BehaviorSubject<DemoRequestViewModel[]>([]);

  constructor(
    private authService: AuthService,
    private firebaseService: AngularFirestore,
    private http: HttpClient
  ) {}

  get demoRequests() {
    return this._demoRequest.asObservable();
  }

  getDemoRequestById(demoId: string) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        return this.firebaseService
          .collection('demo-request')
          .doc(demoId)
          .valueChanges();
      }),
      map((request) => {
        return <DemoRequest>{ ...(request as {}) };
      }),
      first()
    );
  }

  async getDemoApprovers() {
    const approvers = await this.firebaseService
      .collection('demo-approvers')
      .valueChanges()
      .pipe(first())
      .toPromise();
    console.log(approvers);
    return approvers;
  }

  addDemoRequest(demoRequest: DemoRequest) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        demoRequest.userId = fetchedUserId;
        demoRequest.createdOn = new Date();
        return this.firebaseService
          .collection('demo-request')
          .add(Object.assign({}, demoRequest));
      }),
      switchMap((doc) => {
        return this.demoRequests;
      }),
      take(1),
      tap((request) => {
        let viewModel = <DemoRequestViewModel>demoRequest;
        this._demoRequest.next(request.concat(viewModel));
      })
    );
  }

  editDemoRequest(demoRequest: DemoRequest, demoId: string) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        demoRequest.userId = fetchedUserId;
        demoRequest.createdOn = new Date();
        return this.firebaseService
          .collection('demo-request')
          .doc(demoId)
          .update(Object.assign({}, demoRequest));
      }),
      switchMap((doc) => {
        return this.demoRequests;
      }),
      take(1),
      tap((request) => {
        let viewModel = <DemoRequestViewModel>demoRequest;
        this._demoRequest.next(request.concat(viewModel));
      })
    );
  }

  deleteDemoRequest(demoId: string) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        return this.firebaseService
          .collection('demo-request')
          .doc(demoId)
          .delete();
      }),
      switchMap((doc) => {
        return this.demoRequests;
      }),
      take(1),
      tap((request) => {
        this._demoRequest.next(request.filter((b) => b.docId !== demoId));
      })
    );
  }

  fetchDemoRequest() {
    let fetchedUserId: string;
    let fetchUserRoles: string[];
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        return this.authService.userRoles;
      }),
      map((userRoles) => {
        fetchUserRoles = userRoles;
      }),
      switchMap(() => {
        if (
          fetchUserRoles.indexOf('admin') >= 0 ||
          fetchUserRoles.indexOf('Demo Requisition Approver') >= 0
        )
          return this.firebaseService
            .collection('demo-request')
            .snapshotChanges();
        else
          return this.firebaseService
            .collection('demo-request', (ref) =>
              ref.where('userId', '==', fetchedUserId)
            )
            .snapshotChanges();
      }),
      map((requests) => {
        return requests.map((req) => {
          let viewModel = <DemoRequestViewModel>{
            ...(req.payload.doc.data() as {}),
          };
          viewModel.docId = req.payload.doc.id;
          return viewModel;
        });
      }),
      take(1),
      map((requests) => {
        this._demoRequest.next(requests);
      })
    );
  }

  updateDemoStatus(
    demoId: string,
    status: string,
    approverComment: string,
    isAprroveReject: boolean = false
  ) {
    let fetchedUserId: string;
    let fetchedUserName: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        return this.authService.userName;
      }),
      map((username) => {
        fetchedUserName = username;
        return username;
      }),
      switchMap(() => {
        if (!isAprroveReject)
          return this.firebaseService
            .collection('demo-request')
            .doc(demoId)
            .update({
              reqStatus: status,
              approverComment: approverComment,
              userId: fetchedUserId,
            });
        else
          return this.firebaseService
            .collection('demo-request')
            .doc(demoId)
            .update({
              reqStatus: status,
              approverComment: approverComment,
              approverUserId: fetchedUserId,
              approverUserName: fetchedUserName,
              approverDate: new Date(),
            });
      }),
      switchMap((doc) => {
        return this.demoRequests;
      }),
      take(1),
      tap((request) => {
        let req = request.filter((r) => r.docId == demoId);
        req[0].reqStatus = status;
        let viewModel = <DemoRequestViewModel>req[0];
        this._demoRequest.next(request.concat(viewModel));
      })
    );
  }

  async getUserByEmail(userId: string) {
    const user = await this.firebaseService
      .collection('user-roles', (ref) => ref.where('userId', '==', userId))
      .valueChanges()
      .pipe(first())
      .toPromise();
    return <UserRole>user[0];
  }

  async sendEmail(emailobj) {
    return await this.http
      .post(
        'https://us-central1-db-xtc-cafe-dev.cloudfunctions.net/emailMessage',
        emailobj
      )
      .pipe(map((res) => res))
      .toPromise();
  }
}
