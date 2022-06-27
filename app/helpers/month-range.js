import { helper } from '@ember/component/helper';
import moment from 'moment';

export function monthChecker([month, year, startMonth, endMonth, startYear, endYear, timeZone, browserTimeZone]) {
  const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

  function convertToTimeZone(time) {
    if (timeZone !== '') {
      return moment(time, TIME_FORMAT).tz(timeZone);
    } else if (browserTimeZone !== '') {
      return moment(time, TIME_FORMAT).tz(browserTimeZone);
    } else {
      return moment(time, TIME_FORMAT).utc();
    }
  }
  let classes = '';

  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let monthIndex = months.indexOf(month);
  let startMonthIndex = months.indexOf(startMonth);
  let endMonthIndex = months.indexOf(endMonth);

  let today = new Date(convertToTimeZone(moment()).startOf('day').format(TIME_FORMAT));

  let previousMonth = moment(new Date(startYear, startMonthIndex)).subtract(1, 'months');
  previousMonth = new Date(previousMonth);

  const monthDifference = moment(new Date(endYear, endMonthIndex)).diff(new Date(startYear, startMonthIndex), 'months', true);
  if (startMonth === month && startYear === year) {
    classes += ' selected-month';
  }

  if (previousMonth.getTime() === new Date(year, monthIndex).getTime()) {
    classes += ' offset-month';
  }
  const offsetStartMonth = moment(new Date(startYear, startMonthIndex)).subtract(monthDifference + 1, 'months');

  if (startMonth === month && startYear === year) {
    classes += ' selected-month';
  }

  if (new Date(year, monthIndex) > today) {
    classes += 'future-months';
  }

  if (`${month} ${year}`.toUpperCase() === moment(today).format('MMM YYYY').toUpperCase()) {
    classes += ' current-month';
  }

  if (![startMonth, endMonth, startYear, endYear].includes(undefined)) {
    classes += '';

    if (new Date(startYear, startMonthIndex) < new Date(year, monthIndex) && new Date(endYear, endMonthIndex) > new Date(year, monthIndex)) {
      classes += ' in-between-month';
    }

    if (new Date(offsetStartMonth).getTime() <= new Date(year, monthIndex).getTime() && new Date(year, monthIndex).getTime() < new Date(startYear, startMonthIndex).getTime()) {
      classes += ' offset-month';
    }

    if (endMonth === month && endYear === year) {
      classes += ' selected-month';
    }
  }
  return classes;
}

export default helper(monthChecker);
