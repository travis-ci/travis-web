import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';

const countrySentenceOverrides = {
  newzealand: 'New Zealand',
  occupiedcanada: 'occupied Canada',
  uk: 'United Kingdom',
  ukswitzerland: 'UK/Switzerland',
  usa: 'United States of America',
  polandchile: 'Poland and Chile',
  germanycolombia: 'Germany and Colombia'
};

function countryToSentence(country) {
  const override = countrySentenceOverrides[country];

  if (override) {
    return override;
  } else {
    return country.capitalize();
  }
}

export default Component.extend({
  tagName: 'li',
  classNames: ['team-member'],

  countrySentence: computed('member.country', function () {
    let country = this.get('member.country');
    return countryToSentence(country);
  }),

  nationalitySentence: computed('member.nationality', function () {
    let nationality = this.get('member.nationality');
    return countryToSentence(nationality);
  }),

  countryOrAlias: or('member.countryAlias', 'member.country'),
});
