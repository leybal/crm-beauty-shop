import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from "../../services/index";
import { User } from "../../models/index";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private currentRout: ActivatedRoute,
  ) { }

  ngOnInit() {
    const id: string = this.currentRout.snapshot.paramMap.get('id');
    this.userService.getById(id).subscribe(user => {
      user.avatar = 'https://beautyshop-server.herokuapp.com/images/avatars/' + user.avatar;
      this.user = user;
    });
  }

}
