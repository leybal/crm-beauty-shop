import { Component, OnInit, DoCheck, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService, UserService } from "../../services";
import { confirmPasswordValidator } from "../../validators";
import { User } from "../../models";
import {HttpClient} from "@angular/common/http";

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
  loading = false;
  user: User;

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private http: HttpClient
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
      token: [''],
    });
  }

  @ViewChild('fileInput') fileInput: File;

  ngOnInit() {
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
    const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    this.userService.getById(currentUser.id).subscribe(user => {
      this.user = user;
      //this.user.avatar = 'https://beautyshop-server.herokuapp.com/images/avatars/' + user.avatar;
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

  selectedFile: File = null;

  onFileChange(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }

  onUpload(){
    const fd = new FormData();
    const URL = 'https://beautyshop-server.herokuapp.com/api/';
    fd.append('image', this.selectedFile, this.selectedFile.name);
    fd.append('name', this.user.name);
    fd.append('email', this.user.email);
    fd.append('phoneNumber', this.user.phoneNumber);
    fd.append('password', this.user.password);
    fd.append('userInfo', this.user.userInfo);


    this.loading = true;
    this.userService.update(fd)
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
  //   onFileChange(event) {
  //   //console.log(event.target.files[0]);
  //   const reader = new FileReader();
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.editProfileForm.get('avatar').setValue({
  //         filename: file.name,
  //         filetype: file.type,
  //         value: reader.result.split(',')[1]
  //       });
  //     };
  //   }
  //
  // }

  clearFile() {
    this.editProfileForm.get('avatar').setValue(null);
    //this.fileInput.nativeElement.value = '';
  }

  setPasswordValue(password) {
    this.userPassword = password;
  }

  setConfPassword(confPassword) {
    this.userConfPassword = confPassword;
  }


  postData(editProfileForm: any) {
    this.userModel = editProfileForm.value;
    this.userModel.id = this.user.id;
    this.userModel.token = this.user.token;

    //console.log(this.userModel );

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
