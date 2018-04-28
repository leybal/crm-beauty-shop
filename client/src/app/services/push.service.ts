import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition, MatDialog, MatDialogRef } from "@angular/material";
import { DialogComponent} from '../shared/dialog/dialog.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class PushService {
  private apiUrl = environment.apiUrl;
  private swScope: string = './';
  readonly VAPID_PUBLIC_KEY = 'BMfWT-1Ld5b8GilFfXknzMXBgX6I5rNhOU8t4IH9tAs16qfSRhD3Y7OpLw9DjIi8ZRusnB061kdU-SjRllY0TnA';

  private  userSubscribed = new BehaviorSubject<boolean>(false);
  cast = this.userSubscribed.asObservable();

  setAutoHide = true;
  autoHide = 3000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  addExtraClass = false;
  config: any;
  dialogComponentRef: MatDialogRef<DialogComponent>;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.config = this._createConfig();
  }

  getUserSubscribed(endpoint: string) {
    return this.http.post<any>(this.apiUrl + 'checksubscribe', {endpoint: endpoint});
  }

  addSubscriber(subscription) {
    return this.http.post(this.apiUrl + 'subscribe', subscription)
      .catch(this.handleError);
  }

  deleteSubscriber(subscription) {
    return this.http.delete(this.apiUrl + 'unsubscribe', subscription)
      .catch(this.handleError);
  }

  getEndPoint(): Promise<any> {
    let promise = new Promise(resolve => {
      navigator['serviceWorker']
        .getRegistration(this.swScope)
        .then(registration => {
          registration.pushManager
            .getSubscription()
            .then(pushSubscription => resolve(pushSubscription))
        })
    });

    return promise;
  }

  checkSubscribe() {
    if ('serviceWorker' in navigator && environment.production) {
      this.getEndPoint()
        .then(pushSubscription => {
          if (pushSubscription) {
            this.getUserSubscribed(pushSubscription.endpoint)
              .subscribe(res => this.userSubscribed.next(res.subscribed))
          } else {
            this.userSubscribed.next(false)
          }
        });
    }
  }

  generatePush(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator && environment.production) {
        let convertedVapidKey = this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY);
        navigator['serviceWorker']
          .getRegistration(this.swScope)
          .then(registration => {
            registration.pushManager
              .subscribe({userVisibleOnly: true, applicationServerKey: convertedVapidKey})
          })
          .then(() => resolve(true))
      } else {
        reject(false);
      }
    });

    return promise;
  }

  confirmPushSubscribe() {
    if ('serviceWorker' in navigator && environment.production) {
      this.dialogComponentRef = this.dialog.open(DialogComponent);

      this.dialogComponentRef
        .afterClosed()
        .subscribe(res => {
          if (res === true) {
            this.getEndPoint()
              .then(pushSubscription => {
                // App should have pushSubscription
                this.addSubscriber(pushSubscription)
                  .subscribe(
                    res => {
                      console.log('[App] Add subscriber request answer', res);
                      this.userSubscribed.next(true);
                      this.snackBar.open('Now you are subscribed', null, this.config);
                    },
                    err => {
                      console.error('[App] Add subscriber request failed', err);
                      this.snackBar.open('Subscription failed', null, this.config);
                    }
                  )
              })
          }
        });
    }
  }

  unsubscribeToPush() {
    if ('serviceWorker' in navigator && environment.production) {
      this.getEndPoint()
        .then(pushSubscription => {
          this.deleteSubscriber(pushSubscription)
            .subscribe(
              res => {
                if (res.subscribed === false) {
                  this.userSubscribed.next(false);
                  this.snackBar.open('Now you are unsubscribed', null, this.config);
                } else {
                  this.userSubscribed.next(true);
                  this.snackBar.open('Unsubscription failed', null, this.config);
                }
              })
        })
        .catch(err => {
          console.error(err);
        })
    }
  }

  private _createConfig() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    config.panelClass = this.addExtraClass ? ['bs-snack-bar'] : undefined;
    return config;
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.statusText || 'Network error'}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
