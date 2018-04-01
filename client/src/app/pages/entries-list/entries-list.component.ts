import { Component, OnInit } from '@angular/core';
import { EntryService } from "../../services";
import { User, Entry } from "../../models/index";

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.css']
})
export class EntriesListComponent implements OnInit {
  entries: Entry[] = [];
  currentUser: User;

  constructor(
    private entryService: EntryService,
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.entryService.getByUserId(this.currentUser.id)
      .subscribe(entries => this.entries = entries);
  }

}
