import {Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../../services/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISubscription } from "rxjs/Subscription";

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
    private formBuilder: FormBuilder
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
    this.subscription.unsubscribe();
  }

  login(loginForm) {
    this.loading = true;
    this.subscription = this.authenticationService.login(loginForm.value.email, loginForm.value.password)
      .subscribe(
        data => {
          if (data.id && data.token) {
            this.alertService.success('You\'ve successfully logged in.');
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
