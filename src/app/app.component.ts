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
  public monthSelected = 4;
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
        // console.log(this.campaigns);
      });
  }

  selectYear(year: number) {
    this.yearSelected = year;
    this.firstAndLastDaysArray = new Array<FirstAndLastDay>();
    this.buildTable();
  }

  selectMonth(month: number) {
    this.monthSelected = month;
    this.firstAndLastDaysArray = new Array<FirstAndLastDay>();
    this.buildTable();
  }

  buildTable() {
    // totalDaysInsMonth guarda la cantidad de días que tiene un mes
    const totalDaysInsMonth = this.daysInMonth(this.monthSelected, this.yearSelected);
    const firstDayInMonth = new Date(this.yearSelected + '-' + this.monthSelected + '-' + 1).getDay();
    // Primer semana
    const firstWeek: FirstAndLastDay = new FirstAndLastDay();
    firstWeek.firstDay = 1;

    firstWeek.lastDay = firstDayInMonth !== 6 ? 1 + (6 - firstDayInMonth) : firstWeek.firstDay;
    this.firstAndLastDaysArray.push(firstWeek);
    // console.log(this.firstAndLastDaysArray);

    // Ahora se determinan cuantas semanas faltan para terminar el mes
    const missDays = totalDaysInsMonth - firstWeek.lastDay;

    let weeks = Math.floor((missDays / 7));
    weeks = missDays % 7 === 0 ? weeks : weeks + 1;
    let temporalLastDay = firstWeek.lastDay;

    for (let x = 0; x < weeks; x++) {
      const tempForArray: FirstAndLastDay = new FirstAndLastDay();
      if (x !== weeks - 1) {
        tempForArray.firstDay = temporalLastDay + 1;
        tempForArray.lastDay = temporalLastDay + 7;
        this.firstAndLastDaysArray.push(tempForArray);
        temporalLastDay = tempForArray.lastDay;
      } else {
        // calcular cuantos díás faltan
        const daysToEnd = totalDaysInsMonth - temporalLastDay;
        if (daysToEnd !== 1) {
          tempForArray.firstDay = temporalLastDay + 1;
          tempForArray.lastDay = temporalLastDay + daysToEnd;
        } else {
          tempForArray.firstDay = temporalLastDay + 1;
          tempForArray.lastDay = temporalLastDay + 1;
        }
        this.firstAndLastDaysArray.push(tempForArray);
      }

    }
    console.log(this.firstAndLastDaysArray);
  }



  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }






}
