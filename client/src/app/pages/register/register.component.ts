import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AlertService } from '../../services/';
import { confirmPasswordValidator } from '../../validators/';
import { ISubscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  userPassword: string;
  userConfPassword: string;
  userModel: any = {};
  roles: string[] = ['Customer', 'Master'];
  selectedRole: string = this.roles[0].toLowerCase();
  loading = false;
  timer: any;
  private subscription: ISubscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
    this.registrationForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(15),
        Validators.minLength(1)])],
      email: ['', [Validators.required, Validators.email]],
      role: [''],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.maxLength(13),
        Validators.minLength(10)])],
      password: ['', [Validators.required]],
      confPassword: ['', [Validators.required, confirmPasswordValidator(this)]]
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    clearTimeout(this.timer);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  selectChangeHandler (event: any) {
    this.selectedRole = event.target.value;
  }

  setPasswordValue(password) {
    this.userPassword = password;
  }

  setConfPassword(confPassword) {
    this.userConfPassword = confPassword;
  }


  postData(registrationForm: any) {
    this.userModel = {
      name: registrationForm.controls.name.value,
      email: registrationForm.controls.email.value,
      password: registrationForm.controls.password.value,
      role: this.selectedRole,
      phoneNumber: registrationForm.controls.phoneNumber.value,
    };

    this.loading = true;
    this.subscription = this.userService.create(this.userModel)
      .subscribe(
        data => {
          console.log(data);
          if (data.id) {
            this.alertService.success('Registration is completed successfully. ' +
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
