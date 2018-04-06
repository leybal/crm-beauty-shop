import {Component, OnDestroy, OnInit} from '@angular/core';
import { EntryService, AlertService } from "../../services";
import { User, Entry } from "../../models";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NgForm } from '@angular/forms';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.css']
})
export class EntriesListComponent implements OnInit, OnDestroy {
  entries: Entry[] = [];
  currentUser: User;
  loading: boolean = false;
  newStatus: string = '';
  selectedEntry: Entry;
  buttonDisable: boolean = false;
  timer: any;
  private modalRef: NgbModalRef;
  private alive: boolean = true;

  constructor(
    private entryService: EntryService,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getEntries();
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.alive = false;
  }

  getEntries(): void {
    this.entryService.getByUserId(this.currentUser.id, this.currentUser.role)
      .subscribe(entries => this.entries = entries);
  }

  open(content, selectedEntry, newStatus) {
    this.newStatus = newStatus;
    this.selectedEntry = selectedEntry;
    this.modalRef = this.modalService.open(content);
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

    if (this.newStatus === 'Accept') newStatus = 'Accepted';
    if (this.newStatus === 'Reject') newStatus = 'Rejected';
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
          console.log(data);
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
