import { Component, ApplicationRef, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushService } from './services';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = 'BMfWT-1Ld5b8GilFfXknzMXBgX6I5rNhOU8t4IH9tAs16qfSRhD3Y7OpLw9DjIi8ZRusnB061kdU-SjRllY0TnA';
  private swScope: string = './';

  constructor(
    private swPush: SwPush,
    private applicationRef: ApplicationRef,
    private pushService: PushService
  ) {}

  ngOnInit() {
    this.applicationRef.isStable.subscribe(stable => {
      console.log('Is App stable: ' + stable);
      if (!stable) {
        if ('serviceWorker' in navigator && environment.production) {
          navigator.serviceWorker.register('/ngsw-worker.js');

          this.swPush.messages.subscribe(msg => {
            console.log('NEW message ', JSON.stringify(msg));
          })
        }
      }
    });
  }

  subscribeToPush() {
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
                  console.log('[App] Add subscriber request answer', res)
                },
                err => {
                  console.error('[App] Add subscriber request failed', err)
                }

              )

          });

      })
      .catch(err => {
        console.error(err);
      })
  }

  unsubscribeToPush() {
    navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.pushManager
          .getSubscription()
          .then(pushSubscription => {

            this.pushService.deleteSubscriber(pushSubscription)
              .subscribe(

                res => {
                  console.log('[App] Delete subscriber request answer', res)


                  // Unsubscribe current client (browser)
                  pushSubscription.unsubscribe()
                    .then(success => {
                      console.log('[App] Unsubscription successful', success)
                    })
                    .catch(err => {
                      console.log('[App] Unsubscription failed', err)
                    })

                },
                err => {
                  console.error('[App] Delete subscription request failed', err)
                }

              )
          })

      })
      .catch(err => {
        console.error(err);
      })
  }
}
