import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../../services/index';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      role: [''],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/users'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
  }

  login(loginForm) {
    this.loading = true;
    this.authenticationService.login(loginForm.email, loginForm.password)
      .subscribe(
        data => {
          if (data.status === 'error') {
            // show error
            console.log(data);
          } else {
            this.router.navigate([this.returnUrl]);
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
