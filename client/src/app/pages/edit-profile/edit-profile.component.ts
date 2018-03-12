import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/index';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private authentication: AuthenticationService) { }

  ngOnInit() {
    if (!this.authentication.getUserLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

}
