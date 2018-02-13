import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationTime'
})
export class DurationTimePipe implements PipeTransform {

  transform(startDate: number, endDate: number): any {

    let elapsed = endDate - startDate;

    const secPerMinute = 60;
    const secPerHour = secPerMinute * 60;

    if (elapsed < secPerMinute) {
      if(elapsed < 10) {
        return '00:0' + elapsed;
      } else {
        return '00:' + elapsed;
      }
    } else if (elapsed < secPerHour) {
      let minute: any = Math.floor(elapsed / secPerMinute);
      let second: any = Math.floor(elapsed % secPerMinute);
      
      if(minute < 10) {
        minute = '0' + minute + ':';
      } else {
        minute = minute + ':'
      }
      if(second < 10) {
        second = '0' + second;
      }
      return minute + second;
    }

  }

}
