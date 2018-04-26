import { Component, ApplicationRef, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private swUpdate: SwUpdate,
    private applicationRef: ApplicationRef,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    // force SW registration if App is not stable
    this.applicationRef.isStable.subscribe(stable => {
      if (!stable) {
        if ('serviceWorker' in navigator && environment.production) {
          navigator.serviceWorker.register('/ngsw-worker.js');
        }
      }
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
}
