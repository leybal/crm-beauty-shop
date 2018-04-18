import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService, UserService } from "../../services";
import { confirmPasswordValidator } from "../../validators";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {
  changePassForm: FormGroup;
  userPassword: string;
  userConfPassword: string;
  model: any = {};
  loading = false;
  timer: any;
  private subscription: ISubscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
    this.changePassForm = formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confPassword: ['', [Validators.required, Validators.minLength(4), confirmPasswordValidator(this)]]
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    clearTimeout(this.timer);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setPasswordValue(password) {
    this.userPassword = password;
  }

  setConfPassword(confPassword) {
    this.userConfPassword = confPassword;
  }

  postData(registrationForm: any) {
    this.model = {
      newpassword: registrationForm.controls.password.value,
      token: this.activatedRoute.queryParams['value'].token || ''
    };

    this.loading = true;
    this.subscription = this.userService.setPassword(this.model)
      .subscribe(
        data => {
          if (data) {
            this.alertService.success('Your password has been successfully changed. ' +
              'Redirect to login page in 5 seconds');
            this.timer = setTimeout(() => {
              this.router.navigate(['login']);
            }, 5000);
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
