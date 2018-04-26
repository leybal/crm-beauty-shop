import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService, UserService } from "../../services";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPassForm: FormGroup;
  model: any = {};
  loading: boolean = false;
  private subscription: ISubscription;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
    this.forgotPassForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  sendEmail(forgotPassForm: any) {
    this.model = {email: forgotPassForm.value.email};
    this.loading = true;
    this.subscription = this.userService.recovery(this.model)
      .subscribe(
        data => {
          if (data) {
            this.alertService.success('Please check your email in a few minutes.');
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
