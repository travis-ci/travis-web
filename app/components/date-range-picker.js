import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  startMonth: undefined,
  endMonth: undefined,
  startYear: undefined,
  endYear: undefined,
  currentYear: new Date().getUTCFullYear(),
  currentMonth: new Date().toLocaleString('default', { month: 'short' }),
  nextYear: new Date().getUTCFullYear(),
  previousYear: new Date().getUTCFullYear() - 1,
  nextMonth: new Date().toLocaleString('default', { month: 'short' }),
  renderRightArrow: computed('currentYear', 'nextYear', function () {
    return this.get('currentYear') !== this.get('nextYear');
  }),
  isDateSelected: false,
  selectedStartMonth: undefined,
  selectedStartYear: undefined,
  selectedEndMonth: undefined,
  selectedEndYear: undefined,
  calendar: [
    {
      year: computed('previousYear'),
      months: computed('months'),
    },
    {
      year: computed('nextYear'),
      months: computed('months'),
    },
  ],
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],

  actions: {
    onSelectHandler(month, year) {
      const monthDifference = moment(new Date(`${month} ${year}`)).diff(
        new Date(`${this.startMonth} ${this.startYear}`),
        'months',
        true
      );
      if (monthDifference >= 12 || monthDifference < 0) {
        this.set('endMonth', undefined);
        this.set('endYear', undefined);
        this.set('startMonth', undefined);
        this.set('startYear', undefined);
      }
      if (this.startMonth === undefined && this.startYear === undefined) {
        this.set('startMonth', month);
        this.set('startYear', year);
      } else if (
        ![
          this.startMonth,
          this.startYear,
          this.endMonth,
          this.endYear,
        ].includes(undefined)
      ) {
        this.set('endMonth', undefined);
        this.set('endYear', undefined);
        this.set('startMonth', month);
        this.set('startYear', year);
      } else {
        this.set('endMonth', month);
        this.set('endYear', year);
      }
    },
    previousYearSelection() {
      this.set('previousYear', this.previousYear - 1);
      this.set('nextYear', this.nextYear - 1);
    },
    nextYearSelection() {
      var latestYear = moment().format('YYYY');
      if (this.nextYear < latestYear) {
        this.set('previousYear', this.previousYear + 1);
        this.set('nextYear', this.nextYear + 1);
      }
    },
    monthCancelation(dropdown) {
      dropdown.actions.close();
      this.set('endMonth', this.selectedEndMonth);
      this.set('endYear', this.selectedEndYear);
      this.set('startMonth', this.selectedStartMonth);
      this.set('startYear', this.selectedStartYear);
    },
    monthApplyClicked(dropdown) {
      dropdown.actions.close();
      if (
        this.endMonth === undefined &&
        this.endYear === undefined &&
        this.startMonth === undefined &&
        this.startYear === undefined
      ) {
        this.set('isDateSelected', false);
      } else if (
        this.endMonth === undefined &&
        this.endYear === undefined &&
        this.startMonth &&
        this.startYear
      ) {
        this.set('isDateSelected', true);
        this.set('selectedStartMonth', this.startMonth);
        this.set('selectedStartYear', this.startYear);
        this.set('selectedEndMonth', this.startMonth);
        this.set('selectedEndYear', this.startYear);
        let selectedStartDateFormat = `${this.selectedStartYear}-${(this.months.indexOf(this.selectedStartMonth)+1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })}`
        let selectedEndDateFormat =`${this.selectedEndYear}-${(this.months.indexOf(this.selectedEndMonth)+1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })}`
        this.setStartMonth(selectedStartDateFormat);
        this.setEndMonth(selectedEndDateFormat);
      } else {
        this.set('selectedStartMonth', this.startMonth);
        this.set('selectedStartYear', this.startYear);
        this.set('selectedEndMonth', this.endMonth);
        this.set('selectedEndYear', this.endYear);
        this.set('isDateSelected', true);
        let selectedStartDateFormat = `${this.selectedStartYear}-${(this.months.indexOf(this.selectedStartMonth)+1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })}`
        let selectedEndDateFormat =`${this.selectedEndYear}-${(this.months.indexOf(this.selectedEndMonth)+1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false
        })}`
        this.setStartMonth(selectedStartDateFormat);
        this.setEndMonth(selectedEndDateFormat);
      }
    },
  },
});
