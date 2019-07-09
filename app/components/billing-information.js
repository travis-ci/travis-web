import Component from '@ember/component';
import { getCountries } from '../utils/countries';

export default Component.extend({
  countries: getCountries,
});
