import { FirstAndLastDay } from './../models/firstAndLastDay.model';
import { Campaign } from './../models/campaign.model';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public yearSelected = 2019;
  public monthSelected = 5;
  public campaigns: Campaign[];
  public firstAndLastDaysArray: FirstAndLastDay[];
  public years = new Array();
  public months = [
    { id: 1, name: 'Enero' }, { id: 2, name: 'Febrero' }, { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' }, { id: 5, name: 'Mayo' }, { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' }, { id: 8, name: 'Agosto' }, { id: 9, name: 'Septiembre' },
    { id: 10, name: 'Octubre' }, { id: 11, name: 'Noviembre' }, { id: 12, name: 'Diciembre' }
  ];

  constructor(public http: HttpClient) {
    this.campaigns = new Array<Campaign>();
    this.firstAndLastDaysArray = new Array<FirstAndLastDay>();
  }

  ngOnInit() {
    this.buildYearsArray();
    this.getCampaignData();
    this.buildTable();
  }

  buildYearsArray() {
    for (let x = 2000; x < 2020; x++) {
      this.years.push(x);
    }
  }

  getCampaignData() {
    this.http.get<Array<Campaign>>('./assets/data/campaign.json')
      .subscribe(res => {
        this.campaigns = res;
        console.log(this.campaigns);
      });
  }

  selectYear(year: number) {
    this.yearSelected = year;
    // this.buildTable();
  }

  selectMonth(month: number) {
    this.monthSelected = month;
    // this.buildTable();
  }

  buildTable() {
    // totalDaysInsMonth guarda la cantidad de días que tiene un mes
    const totalDaysInsMonth = this.daysInMonth(this.monthSelected, this.yearSelected);
    const firstDayInMonth = new Date(this.yearSelected + '-' + this.monthSelected + '-' + 1).getDay();
    // Primer semana
    const firstLast: FirstAndLastDay = new FirstAndLastDay();
    firstLast.firstDay = 1;
    if (firstDayInMonth !== 6) {
      firstLast.lastDay = 1 + (6 - firstDayInMonth);
    } else {
      firstLast.lastDay = firstLast.firstDay;
    }
    this.firstAndLastDaysArray.push(firstLast);
    console.log(this.firstAndLastDaysArray);

  }

  buildWeeks(firstDay) {
    for (let x = firstDay; x <= 6; x++) {

    }
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }






}
