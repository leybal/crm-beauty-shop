import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { UserService } from '../../services/index';
import { confirmPasswordValidator } from '../../validators/index';
import { AlertService } from "../../services";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  userPassword: string;
  userConfPassword: string;
  userModel: any = {};
  roles: string[] = ['Customer', 'Master'];
  selectedRole: string = this.roles[0].toLowerCase();
  loading = false;

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
    this.userService.create(this.userModel)
      .subscribe(
        data => {
          console.log(data);
          if (data.id) {
            this.alertService.success('Registration is completed successfully. ' +
              'Redirect to login page in 5 seconds');

            IntervalObservable.create(5000)
              .subscribe(() => {
                this.router.navigate(['login']);
              });
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
