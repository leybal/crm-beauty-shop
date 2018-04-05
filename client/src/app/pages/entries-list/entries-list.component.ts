import { Component, OnInit } from '@angular/core';
import { EntryService } from "../../services";
import { User, Entry } from "../../models/index";
import {NgbModal, ModalDismissReasons} from "@ng-bootstrap/ng-bootstrap";
import { NgForm} from '@angular/forms';
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.css']
})
export class EntriesListComponent implements OnInit {
  entries: Entry[] = [];
  currentUser: User;
  closeResult: string;
  masterId: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  loading: boolean = false;
  accept: any;

  constructor(
    private entryService: EntryService,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.entryService.getByUserId(this.currentUser.id, this.currentUser.role)
      .subscribe(entries => this.entries = entries);
    console.log(this.entries)
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  submitForm(form: NgForm) {
    let comment = form.value.comment || '';
    let model: any =  {
      masterId: this.masterId,
      customerId: this.currentUser.id,
      date: this.selectedDate,
      time: this.selectedTime,
      customerComment: comment
    };

    this.loading = true;
    this.entryService.create(model)
      .subscribe(
        data => {
          console.log(data);
          if (data) {

            this.alertService.success('Entry is created successfully.');

          } else {
            this.alertService.error('Error. Please try later.');
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(error.statusText);
          this.loading = false;
        });
  }

  confirmEntry(){
    this.accept = true;
    console.log(this.accept)
  }

  rejectEntry(){
    this.accept = false;
    console.log(this.accept)
  }


}
