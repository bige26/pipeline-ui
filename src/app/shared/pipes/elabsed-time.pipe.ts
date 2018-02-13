import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'elabsedTime'
})
export class ElabsedTimePipe implements PipeTransform {

  transform(startDate: number, endDate?: number): string {

    let current;

    if (endDate === undefined) {
      current = new Date().valueOf();
    } else {
      current = endDate * 1000;
    }

    if (startDate === undefined) {
      return '---';
    }

    const input = new Date(startDate * 1000).valueOf();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - input;

    if (input === NaN) {
      return '---';
    } else if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' days';
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' months';
    } else {
      return Math.round(elapsed / msPerYear) + ' years';
    }
  }

}
