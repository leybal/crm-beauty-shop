import { Component, OnDestroy, OnInit, DoCheck } from '@angular/core';
import { Router } from "@angular/router";
import { EntryService, AlertService, AuthenticationService,  } from "../../services";
import { User, Entry } from "../../models";
import { NgbModal, NgbModalRef, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgForm } from '@angular/forms';
import "rxjs/add/operator/takeWhile";
import {PaginationInstance} from "ngx-pagination";

const now = new Date();

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.css']
})
export class EntriesListComponent implements OnInit, DoCheck, OnDestroy {
  entries: Entry[] = [];
  currentUser: User;
  userAuthorized: boolean;
  loading: boolean = false;
  newStatus: string = '';
  selectedEntry: Entry;
  buttonDisable: boolean = false;
  timer: any;
  private modalRef: NgbModalRef;
  private alive: boolean = true;
  model: NgbDateStruct;
  comment: any;
  date: {year: number, month: number};
  statuses: Array<Object> = [
    {'title': 'All', 'status':['New', 'Accepted', 'Rejected', 'Finished']},
    {'title':'New', 'status':['New']},
    {'title':'Accepted', 'status':['Accepted']},
    {'title':'Rejected', 'status':['Rejected']},
    {'title':'Finished', 'status':['Finished']}
  ];
  selectStatus:  string;
  currentPage: any;
  pageSize: number;
  isEntries: boolean;

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private entryService: EntryService,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.authentication.cast.subscribe(userAuthorized => this.userAuthorized = userAuthorized);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getEntries();
    this.pageSize = 5;
    this.isEntries = false;
  }

  ngDoCheck() {
    if (!this.userAuthorized) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.alive = false;
  }

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  getEntries(): void {
    this.entryService.getByUserId(this.currentUser.id, this.currentUser.role)
      .subscribe(entries => {this.entries = entries; this.isEntries = true;});
  }

  open(content, selectedEntry, newStatus) {
    this.comment = '';
    this.newStatus = newStatus;
    this.selectedEntry = selectedEntry;
    this.modalRef = this.modalService.open(content);
  }

  resetFilters() {
    this.selectStatus = '';
    this.model =  null;
  }

  submitForm(form: NgForm) {
    let masterComment: string = '',
      customerComment: string = '',
      newStatus: string,
      model: any;

    if (this.currentUser.role === 'master') {
      masterComment = form.value.comment || '';
      customerComment = this.selectedEntry.customerComment;
    } else {
      masterComment = this.selectedEntry.masterComment;
      customerComment = form.value.comment || '';
    }

    switch (this.newStatus) {
      case 'Accept':
        newStatus = 'Accepted';
        break;
      case 'Reject':
        newStatus = 'Rejected';
        break;
      case 'Finish':
        newStatus = 'Finished';
        break;
      default:
        newStatus = 'New';
        break;
    }

    model =  {
      masterComment: masterComment,
      customerComment: customerComment,
      status: newStatus
    };

    this.buttonDisable = !this.buttonDisable;
    this.loading = true;
    this.entryService.update(model, this.selectedEntry._id)
      .takeWhile(() => this.alive)
      .subscribe(
        data => {
          if (data._id) {
            this.alertService.success('Status updated successfully.');
          } else {
            this.alertService.error('Error. Please try later.');
          }
        },
        error => this.alertService.error(error.statusText),
        () => {
          this.loading = false;
          this.getEntries();
          this.timer = setTimeout(() => {
            this.modalRef.close();
            this.buttonDisable = !this.buttonDisable;
          }, 2000);
        })
  }
}
