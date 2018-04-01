import {Component, OnInit, DoCheck, ViewChild, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService, AuthenticationService, UserService } from "../../services";
import { confirmPasswordValidator } from "../../validators";
import { User } from "../../models";
import { environment } from '../../../environments/environment';
import { ISubscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, DoCheck, OnDestroy {
  userAuthorized: boolean;
  editProfileForm: FormGroup;
  userPassword: string;
  userConfPassword: string;
  loading = false;
  user: User;
  avatar: File;
  avatarLocalUrl: any[];
  avatarUrl = environment.avatarUrl;
  private subscription: ISubscription;

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
      phoneNumber: ['', Validators.compose([Validators.required, Validators.maxLength(13),
        Validators.minLength(10)])],
      password: ['', [Validators.required]],
      confPassword: ['', [Validators.required, confirmPasswordValidator(this)]],
      userInfo: [''],
    });
  }

  @ViewChild('fileInput') fileInput: File;

  ngOnInit() {
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
    const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    this.subscription = this.userService.getById(currentUser.id)
      .map(user => {
        user.avatar = this.avatarUrl + user.avatar;
        return user;
      })
      .do((user) => {
        this.editProfileForm.get('name').setValue(user.name);
        this.editProfileForm.get('email').setValue(user.email);
        this.editProfileForm.get('phoneNumber').setValue(user.phoneNumber);
        this.editProfileForm.get('userInfo').setValue(user.userInfo);
      })
      .subscribe(user => {
        this.user = user;
      });
  }

  ngDoCheck() {
    if (!this.userAuthorized) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onFileChange(event) {
    this.avatar = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarLocalUrl = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  clearFile() {
    this.avatar = null;
    this.avatarLocalUrl = this.user.avatar;
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
    fd.append('password', editProfileForm.value.password);
    fd.append('userInfo', editProfileForm.value.userInfo);

    this.loading = true;
    this.userService.update(fd, this.user.id)
      .subscribe(
        data => {
          this.userService.updateLocalData(data);
          this.loading = false;
          this.alertService.success('Profile saved successfully.');
        },
        error => {
          console.log(error);
          this.alertService.error(error.error.message);
          this.loading = false;
        });
  }
}
