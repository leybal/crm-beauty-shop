import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, PushService } from '../../services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISubscription } from "rxjs/Subscription";
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  private subscription: ISubscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private pushService: PushService
  ) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/users'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  login(loginForm) {
    this.loading = true;
    this.subscription = this.authenticationService.login(loginForm.value.email, loginForm.value.password)
      .subscribe(
        data => {
          if (data.id && data.token) {
            this.alertService.success('You\'ve successfully logged in.');
            if ('serviceWorker' in navigator && environment.production) {
              if (!this.pushService.checkSubscribe(data.id)) {
                this.pushService.subscribeToPush(data.id);
              }
            }
            this.router.navigate([this.returnUrl]);
          } else {
            this.alertService.error('Error. Please try later.');
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(error.error.message);
          this.loading = false;
        });
  }
}
