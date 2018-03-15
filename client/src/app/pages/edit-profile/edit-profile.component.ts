import { Component, OnInit, DoCheck, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService, UserService } from "../../services";
import { confirmPasswordValidator } from "../../validators";
import { User } from "../../models";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, DoCheck {
  userAuthorized: boolean;
  editProfileForm: FormGroup;
  userPassword: string;
  userConfPassword: string;
  userModel: any = {};
  roles: string[] = ['Customer', 'Master'];
  selectedRole: string = this.roles[0].toLowerCase();
  loading = false;
  user: User;

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.editProfileForm = formBuilder.group({
      id: [''],
      avatar: null,
      name: ['', Validators.compose([Validators.required, Validators.maxLength(15),
        Validators.minLength(1)])],
      email: ['', [Validators.required, Validators.email]],
      role: [''],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.maxLength(13),
        Validators.minLength(10)])],
      password: ['', [Validators.required]],
      confPassword: ['', [Validators.required, confirmPasswordValidator(this)]],
      userInfo: [''],
      token: [''],
    });
  }

  @ViewChild('fileInput') fileInput: ElementRef;

  ngOnInit() {
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
    const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    this.userService.getById(currentUser.id).subscribe(user => {
      this.user = user;
      this.user.avatar = 'https://beautyshop-server.herokuapp.com/images/avatars/' + user.avatar;
      this.user.token = currentUser.token;

      this.editProfileForm.get('name').setValue(this.user.name);
      this.editProfileForm.get('email').setValue(this.user.email);
      this.editProfileForm.get('phoneNumber').setValue(this.user.phoneNumber);
      this.editProfileForm.get('userInfo').setValue(this.user.userInfo);
    });
  }

  ngDoCheck() {
    if (!this.userAuthorized) {
      this.router.navigate(['/']);
    }
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.editProfileForm.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  }

  clearFile() {
    this.editProfileForm.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
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


  postData(editProfileForm: any) {
    this.userModel = editProfileForm.value;
    this.userModel.role = this.selectedRole;
    this.userModel.id = this.user.id;
    this.userModel.token = this.user.token;

    console.log(this.userModel );

    this.loading = true;
    this.userService.update(this.userModel)
      .subscribe(
        data => {
          console.log(data);
          this.loading = false;
        },
        error => {
          console.log(error);
          this.loading = false;
        });
  }
}
