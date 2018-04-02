import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { EntryService } from "../../services";
import { Entry } from "../../models/index";

const now = new Date();

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  entries: Entry[] = [];
  dpModel: NgbDateStruct;
  userId: string = '';
  date: string = '';
  entriesStart: number = 9;
  entriesFinish: number = 19;
  entriesStep: number = 1;
  entriesTimes: string[] = [];
  selectedTime: string = '';

  constructor(
    private entryService: EntryService,
    private currentRout: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userId = this.currentRout.snapshot.paramMap.get('id');
    this.selectToday();
    this.date = `${this.dpModel.day}.${this.dpModel.month}.${this.dpModel.year}`;
    this.setEntriesTimes();
    this.entryService.getByUserId(this.userId)
      .subscribe(entries => this.entries = entries);
  }

  selectToday(): void {
    this.dpModel = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  setEntriesTimes(): void {
    for(let i = this.entriesStart; i <= this.entriesFinish; i += this.entriesStep) {
      this.entriesTimes.push(`${i}-00`)
    }
  }

  selectTimeHandler(event: any): void {
    const index = this.entriesTimes.indexOf(event.target.innerHTML);
    if (index > -1) {
      this.selectedTime = this.entriesTimes[index]
    }

    this.entryService.getByUserIdAndDate(this.userId, this.date)
      .subscribe(entries => this.entries = entries);
  }

}
