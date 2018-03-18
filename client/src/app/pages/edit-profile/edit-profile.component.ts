import { Component, OnInit, DoCheck, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {AlertService, AuthenticationService, UserService} from "../../services";
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
  roles: string[] = ['Customer', 'Master'];
  selectedRole: string = this.roles[0].toLowerCase();
  loading = false;
  user: User;
  avatar: File;

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
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

  @ViewChild('fileInput') fileInput: File;

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
    this.avatar = <File>event.target.files[0];
  }

  clearFile() {
    this.avatar = null;
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
    const fd = new FormData();
    if (this.avatar) {
      fd.append('avatar', this.avatar, this.avatar.name);
    } else {
      fd.append('avatar', null);
    }
    fd.append('name', editProfileForm.value.name);
    fd.append('email', editProfileForm.value.email);
    fd.append('phoneNumber', editProfileForm.value.phoneNumber);
    fd.append('role', this.selectedRole);
    fd.append('password', editProfileForm.value.password);
    fd.append('userInfo', editProfileForm.value.userInfo);


    this.loading = true;
    this.userService.update(fd, this.user.id, this.user.token)
      .subscribe(
        data => {
          console.log(data);
          this.alertService.success('Profile saved successfully.');
          this.loading = false;
        },
        error => {
          console.log(error);
          this.alertService.error(error.error.message);
          this.loading = false;
        });
  }
}
