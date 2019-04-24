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
  public totalDaysInsMonth = 0;
  public campaigns: Campaign[];
  public campaignsFill: Campaign[];
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
    this.campaignsFill = new Array<Campaign>();
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
        this.objectsInRangeDate(this.totalDaysInsMonth);
      });
  }

  selectYear(year: number) {
    this.yearSelected = Number(year);
    this.firstAndLastDaysArray = new Array<FirstAndLastDay>();
    this.campaignsFill = new Array<Campaign>();
    this.buildTable();
  }

  selectMonth(month: number) {
    this.monthSelected = Number(month);
    this.firstAndLastDaysArray = new Array<FirstAndLastDay>();
    this.campaignsFill = new Array<Campaign>();
    this.buildTable();
  }

  buildTable() {
    // totalDaysInsMonth guarda la cantidad de días que tiene un mes
    this.totalDaysInsMonth = this.daysInMonth(this.monthSelected, this.yearSelected);
    const firstDayInMonth = new Date(this.yearSelected + '-' + this.monthSelected + '-' + 1).getDay();

    // Primer semana
    const firstWeek: FirstAndLastDay = new FirstAndLastDay();
    firstWeek.firstDay = 1;
    firstWeek.lastDay = firstDayInMonth !== 6 ? 1 + (6 - firstDayInMonth) : firstWeek.firstDay;
    this.firstAndLastDaysArray.push(firstWeek);

    // Ahora se determinan cuantas semanas faltan para terminar el mes
    const missDays = this.totalDaysInsMonth - firstWeek.lastDay;
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
        const daysToEnd = this.totalDaysInsMonth - temporalLastDay;
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
    this.objectsInRangeDate(this.totalDaysInsMonth);
    // console.log(this.firstAndLastDaysArray);
  }

  // Determinar los objetos que estan en el mes seleccionado
  objectsInRangeDate(finishDay) {
    const initDate = new Date(this.yearSelected + '-' + this.monthSelected + '-' + 1).getTime();
    const finishDate = new Date(this.yearSelected + '-' + this.monthSelected + '-' + finishDay).getTime();
    // console.log(initDate, finishDate);
    // console.log('MES', this.monthSelected);
    for (let x = 0; x < this.campaigns.length; x++) {
      let initTemporalDate = 0;
      let finishTemporalDate = 0;
      initTemporalDate = this.getMili(this.campaigns[x].started_at);
      finishTemporalDate = this.getMili(this.campaigns[x].finished_at);
      if (initTemporalDate >= initDate && initTemporalDate <= finishDate) {
        this.campaignsFill.push(this.campaigns[x]);
      } else if (finishTemporalDate >= initDate && finishTemporalDate <= finishDate) {
        this.campaignsFill.push(this.campaigns[x]);
      } else if (initTemporalDate <= initDate && finishTemporalDate >= finishDate) {
        this.campaignsFill.push(this.campaigns[x]);
      } else if (Number(this.campaigns[x].started_at.split('-')[1]) === this.monthSelected
        && Number(this.campaigns[x].started_at.split('-')[2]) === finishDay
        && Number(this.campaigns[x].started_at.split('-')[0]) === this.yearSelected) {
        this.campaignsFill.push(this.campaigns[x]);
      } else if (Number(this.campaigns[x].finished_at.split('-')[1]) === this.monthSelected
        && Number(this.campaigns[x].finished_at.split('-')[2]) === finishDay
        && Number(this.campaigns[x].finished_at.split('-')[0]) === this.yearSelected) {
        this.campaignsFill.push(this.campaigns[x]);
      } else if (Number(this.campaigns[x].started_at.split('-')[1]) === this.monthSelected
        && Number(this.campaigns[x].started_at.split('-')[2]) === initDate
        && Number(this.campaigns[x].started_at.split('-')[0]) === this.yearSelected) {
        this.campaignsFill.push(this.campaigns[x]);
      } else if (Number(this.campaigns[x].finished_at.split('-')[1]) === this.monthSelected
        && Number(this.campaigns[x].finished_at.split('-')[2]) === initDate
        && Number(this.campaigns[x].finished_at.split('-')[0]) === this.yearSelected) {
        this.campaignsFill.push(this.campaigns[x]);
      }

    }

    this.campaignsFill.forEach(obj => {
      obj.weeks = new Array();
    });

    // console.log('CAMPAÑAS DEL MES', this.campaignsFill);
    this.filtterByCampaign();
  }

  getMili(date: string) {
    const one_day = 1000 * 60 * 60 * 24;
    let milli = 0;
    milli = new Date(date).getTime() + one_day;
    return milli;
  }

  filtterByCampaign() {
    const one_day = 1000 * 60 * 60 * 24;
    for (let x = 0; x < this.firstAndLastDaysArray.length; x++) {
      const initDate = new Date(this.yearSelected + '-' + this.monthSelected + '-' + this.firstAndLastDaysArray[x].firstDay).getTime();
      const finishDate = new Date(this.yearSelected + '-' + this.monthSelected + '-' + this.firstAndLastDaysArray[x].lastDay).getTime();
      this.campaignsFill.forEach(obj => {
        const initDate2 = new Date(obj.started_at).getTime() + one_day;
        const finishDate2 = new Date(obj.finished_at).getTime() + one_day;
        const isInrange = this.calcaulateInterceptDateRanges(initDate, finishDate, initDate2, finishDate2);
        obj.weeks.push(isInrange);
      });
    }
    console.log(this.campaignsFill);
  }


  calcaulateInterceptDateRanges(start1: number, finish1: number, start2: number, finish2: number) {
    const one_day = 1000 * 60 * 60 * 24;
    let isInRange = false;
    if (start1 !== finish1) {
      for (let i = start1; i <= finish1; i = i + one_day) {
        for (let x = start2; x <= finish2; x = x + one_day) {
          if (x >= start1 && x <= finish1) {
            isInRange = true;
          } else if (x === finish1) {
            isInRange = true;
          }
        }
      }
    } else if (start1 === finish1) {
      if (start1 >= start2 && start1 <= finish2) {
        isInRange = true;
      }
    }
    return isInRange;
  }


  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }






}
