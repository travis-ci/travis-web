import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function monthChecker([
  month,
  year,
  startMonth,
  endMonth,
  startYear,
  endYear,
]) {
  var classes = '';
  var today = new Date();
  let previousMonth = moment(new Date(`${startMonth} ${startYear}`)).subtract(
    1,
    'months'
  );
  previousMonth = new Date(previousMonth);

  const monthDifference = moment(new Date(`${endMonth} ${endYear}`)).diff(
    new Date(`${startMonth} ${startYear}`),
    'months',
    true
  );

  if (startMonth === month && startYear === year) {
    classes += ' selected-month';
  }

  if (previousMonth.getTime() === new Date(`${month}${year}`).getTime()) {
    classes += ' offset-month';
  }
  const offsetStartMonth = moment(
    new Date(`${startMonth} ${startYear}`)
  ).subtract(monthDifference + 1, 'months');

  if (startMonth === month && startYear === year) {
    classes += ' selected-month';
  }

  if (new Date(`${month} ${year}`) > today) {
    classes += 'future-months';
  }

  if (
    `${month} ${year}`.toUpperCase() ===
    moment(new Date()).format('MMM YYYY').toUpperCase()
  ) {
    classes += ' current-month';
  }

  if (![startMonth, endMonth, startYear, endYear].includes(undefined)) {
    classes += '';

    if (
      new Date(`${startMonth} ${startYear}`) < new Date(`${month} ${year}`) &&
      new Date(`${endMonth} ${endYear}`) > new Date(`${month} ${year}`)
    ) {
      classes += ' in-between-month';
    }

    if (
      new Date(offsetStartMonth).getTime() <=
        new Date(`${month} ${year}`).getTime() &&
      new Date(`${month} ${year}`).getTime() <
        new Date(`${startMonth} ${startYear}`).getTime()
    ) {
      classes += ' offset-month';
    }

    if (endMonth === month && endYear === year) {
      classes += ' selected-month';
    }
  }
  return classes;
});
