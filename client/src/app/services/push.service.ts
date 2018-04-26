import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition } from "@angular/material";

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

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {
    this.config = this._createConfig();
  }

  getUserSubscribed(userId: string) {
    return this.http.get<any>(this.apiUrl + `checksubscribe/${userId}`);
  }

  addSubscriber(subscription, userId) {
    // subscription.userId = userId;
    // console.log('subscription ', subscription);

    return this.http.post(this.apiUrl + 'subscribe', subscription)
      .catch(this.handleError);
  }

  deleteSubscriber(subscription) {
    return this.http.post(this.apiUrl + 'unsubscribe', subscription)
      .catch(this.handleError);
  }

  checkSubscribe(userId: string): boolean {
    if (!userId) return false;

    this.getUserSubscribed(userId)
      .subscribe(data => {
        if (data.subscribed) {
          this.userSubscribed.next(true);
          return true;
        } else {
          this.userSubscribed.next(false);
          return false;
        }
      },
      err => {
        console.log(err);
        return false;
      });
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

  subscribeToPush(userId: string) {
    if ('serviceWorker' in navigator && environment.production) {
      let convertedVapidKey = this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY);
      navigator['serviceWorker']
        .getRegistration(this.swScope)
        .then(registration => {
          registration.pushManager
            .subscribe({ userVisibleOnly: true, applicationServerKey: convertedVapidKey })
            .then(pushSubscription => {
              this.addSubscriber(pushSubscription, userId)
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
            });
        })
        .catch(err => {
          console.error(err);
        })
    }
  }

  unsubscribeToPush() {
    if ('serviceWorker' in navigator && environment.production) {
      navigator['serviceWorker']
        .getRegistration(this.swScope)
        .then(registration => {
          registration.pushManager
            .getSubscription()
            .then(pushSubscription => {
              this.deleteSubscriber(pushSubscription)
                .subscribe(
                  res => {
                    console.log('[App] Delete subscriber request answer', res);
                    // Unsubscribe current client (browser)
                    pushSubscription.unsubscribe()
                      .then(success => {
                        console.log('[App] Unsubscription successful', success);

                        this.userSubscribed.next(false);
                        this.snackBar.open('Now you are unsubscribed', null, this.config);
                      })
                      .catch(err => {
                        console.log('[App] Unsubscription failed', err);

                        this.snackBar.open('Unsubscription failed', null, this.config);
                      })
                  },
                  err => {
                    console.error('[App] Delete subscription request failed', err);
                  }
                )
            })
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
}
