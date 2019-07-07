import Component from '@ember/component';
import { generateYearsFromCurrent, generateMonthNumber } from '../utils/generated-dates';

export default Component.extend({
  months: generateMonthNumber(),
  years: generateYearsFromCurrent(11)
});
