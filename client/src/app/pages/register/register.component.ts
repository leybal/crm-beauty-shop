import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { UserService } from '../../services/index';
import { confirmPasswordValidator } from '../../validators/index';

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
    private formBuilder: FormBuilder
  ) {
    this.registrationForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.minLength(1)])],
      email: ['', [Validators.required, Validators.email]],
      role: [''],
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


  postData(registrationForm: NgForm) {
    this.userModel = {
      name: registrationForm.controls.name.value,
      email: registrationForm.controls.email.value,
      password: registrationForm.controls.password.value,
      role: this.selectedRole,
    };

    console.log(this.userModel);

    this.loading = true;
    this.userService.create(this.userModel)
      .subscribe(
        data => {
          // if (data.status === 'ok') {
          //   this.router.navigate(['login']);
          // } else {
          //   console.log(data);
          // }
          // this.router.navigate(['login']);
          this.loading = false;
        },
        error => {
          console.log(error);
          this.loading = false;
        });
  }
}
