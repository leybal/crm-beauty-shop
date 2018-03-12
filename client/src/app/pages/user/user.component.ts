import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/index";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: object;

  constructor(
    private userService: UserService,
    private currentRout: ActivatedRoute,
  ) { }

  ngOnInit() {
    const id: string = this.currentRout.snapshot.paramMap.get('id');
    this.userService.getById(id).subscribe(user => {
      this.user = user;
    });
  }

}
