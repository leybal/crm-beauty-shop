import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AlertService, EntryService } from "../../services";
import { Entry, User } from "../../models";
import { NgForm } from '@angular/forms';
import 'rxjs/add/operator/map';

const now = new Date();

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
})
export class EntriesComponent implements OnInit {
  entries: Entry[] = [];
  entriesForTemplate: any[] = [];
  dpModel: NgbDateStruct;
  masterId: string = '';
  currentUser: User;
  selectedDate: string = '';
  selectedTime: string = '';
  entriesStart: number = 9;
  entriesFinish: number = 19;
  entriesStep: number = 1;
  entriesTimes: string[] = [];
  availableEntriesTimes: boolean[] = [];
  comment: any;
  entriesLoading: boolean = false;
  loading: boolean = false;
  timer: any;
  private modalRef: NgbModalRef;

  @Input() user;
  @Input() userAuthorized;
  @Input() profileOwner;


  constructor(
    private entryService: EntryService,
    private currentRout: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.masterId = this.currentRout.snapshot.paramMap.get('id');
    this.setEntriesTimes();
    this.selectToday();
    this.selectedDateHandler();

    console.log(this.profileOwner);
  }

  setEntriesTimes(): void {
    for(let i = this.entriesStart; i <= this.entriesFinish; i += this.entriesStep) {
      this.entriesTimes.push(`${i}-00`)
    }
  }

  selectToday(): void {
    this.dpModel = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  setAvailableTime(): void {
    this.entriesLoading = true;
    this.entryService.getByUserIdAndDate(this.masterId, this.selectedDate)
      .subscribe(
        entries => this.entries = entries,
        error => console.log("Error: ", error),
        () => {
          for (let i = 0; i < this.entriesTimes.length; i++) {
            this.availableEntriesTimes[i] = true;
            this.entriesForTemplate[i] = {};
          }
          for (let entry of this.entries) {
            let index = this.entriesTimes.indexOf(entry.time);
            if (index > -1) {
              this.availableEntriesTimes[index] = false;
              this.entriesForTemplate[index] = entry;
            }
          }
          this.entriesLoading = false;
        }
      )
  }

  selectedDateHandler(): void {
    let day: string = this.dpModel.day.toString();
    let month: string = this.dpModel.month.toString();
    if (day.length === 1) day = '0' + day;
    if (month.length === 1) month = '0' + month;

    this.selectedDate = `${day}.${month}.${this.dpModel.year}`;
    this.setAvailableTime();
  }

  selectTimeHandler(event: any): void {
    const index = this.entriesTimes.indexOf(event.target.innerText);
    if (index > -1) {
      this.selectedTime = this.entriesTimes[index]
    }
  }

  open(content) {
    this.modalRef = this.modalService.open(content);
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
            this.setAvailableTime();
            this.alertService.success('Entry is created successfully.');
            this.timer = setTimeout(() => {
              this.modalRef.close();
            }, 500);
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
}
