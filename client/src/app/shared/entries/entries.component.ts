import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AlertService, EntryService } from "../../services";
import { Entry, User } from "../../models";
import { NgForm } from '@angular/forms';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
})
export class EntriesComponent implements OnInit, OnDestroy {
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
  availableTimes: boolean[] = [];
  comment: any;
  entriesLoading: boolean = false;
  loading: boolean = false;
  buttonDisable: boolean = false;
  now: any = new Date();
  timer: any;
  private modalRef: NgbModalRef;
  private alive: boolean = true;

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
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.alive = false;
  }

  setEntriesTimes(): void {
    for(let i = this.entriesStart; i <= this.entriesFinish; i += this.entriesStep) {
      this.entriesTimes.push(`${i}-00`)
    }
  }

  selectToday(): void {
    this.dpModel = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
  }

  setAvailableTimes(): void {
    for (let i = 0; i < this.entriesTimes.length; i++) {
      let hour, minute;
      if (this.entriesTimes[i].length === 5) {
        hour = parseInt(this.entriesTimes[i].slice(0, 2));
        minute = parseInt(this.entriesTimes[i].slice(3));
      } else {
        hour = parseInt(this.entriesTimes[i].slice(0, 1));
        minute = parseInt(this.entriesTimes[i].slice(2));
      }
      let locEntryTime = new Date(`${this.dpModel.year},${this.dpModel.month}, ${this.dpModel.day} 
              ${hour}:${minute}`);
      if (this.now < locEntryTime) {
        this.availableTimes[i] = true;
      } else {
        this.availableTimes[i] = false;
      }
    }
  }

  setAvailableEntriesTimes(): void {
    this.entriesLoading = true;
    this.entryService.getByUserIdAndDate(this.masterId, this.selectedDate)
      .takeWhile(() => this.alive)
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
              if (entry.status === 'Accepted') {
                this.availableEntriesTimes[index] = false;
              }
              this.entriesForTemplate[index] = entry;
            }
          }
          this.setAvailableTimes();
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
    this.setAvailableEntriesTimes();
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

    this.buttonDisable = !this.buttonDisable;
    this.loading = true;
    this.entryService.create(model)
      .takeWhile(() => this.alive)
      .subscribe(
        data => {
          if (data._id ) {
            this.alertService.success('Entry created successfully.');
          } else {
            this.alertService.error('Error. Please try later.');
          }
        },
        error => this.alertService.error(error.statusText),
        () => {
          this.loading = false;
          this.now = new Date();
          this.setAvailableEntriesTimes();
          this.timer = setTimeout(() => {
            this.modalRef.close();
            this.buttonDisable = !this.buttonDisable;
          }, 2000);
        });
  }
}
