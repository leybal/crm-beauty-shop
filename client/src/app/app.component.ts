import { Component, ApplicationRef, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { PushService } from './services';
import { environment } from './../environments/environment';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition } from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = 'BMfWT-1Ld5b8GilFfXknzMXBgX6I5rNhOU8t4IH9tAs16qfSRhD3Y7OpLw9DjIi8ZRusnB061kdU-SjRllY0TnA';
  private swScope: string = './';
  setAutoHide = true;
  autoHide = 3000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  addExtraClass = false;
  config: any;

  constructor(
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private applicationRef: ApplicationRef,
    private pushService: PushService,
    private snackBar: MatSnackBar,
  ) {
    this.config = this._createConfig();
  }

  ngOnInit() {
    // register SW if App is not stable
    this.applicationRef.isStable.subscribe(stable => {
      if (!stable) {
        if ('serviceWorker' in navigator && environment.production) {
          navigator.serviceWorker.register('/ngsw-worker.js');
        }
      }
    });

    this.swPush.messages.subscribe(msg => {
      //let message = JSON.parse(msg);
      console.log('NEW message ', JSON.stringify(msg));
      this.snackBar.open(`${msg['title']}. ${msg['body']}`, null, this.config);
    });

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(event => {
        const snackBarRef = this.snackBar.open('Update available', 'Reload');
        snackBarRef
          .onAction()
          .subscribe(() => {
            window.location.reload();
          });
      });
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

  subscribeToPush() {
    if ('serviceWorker' in navigator && environment.production) {
      let convertedVapidKey = this.pushService.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY);
      navigator['serviceWorker']
        .getRegistration(this.swScope)
        .then(registration => {
          registration.pushManager
            .subscribe({ userVisibleOnly: true, applicationServerKey: convertedVapidKey })
            .then(pushSubscription => {
              this.pushService.addSubscriber(pushSubscription)
                .subscribe(
                  res => {
                    console.log('[App] Add subscriber request answer', res);

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
              this.pushService.deleteSubscriber(pushSubscription)
                .subscribe(
                  res => {
                    console.log('[App] Delete subscriber request answer', res);
                    // Unsubscribe current client (browser)
                    pushSubscription.unsubscribe()
                      .then(success => {
                        console.log('[App] Unsubscription successful', success);

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
