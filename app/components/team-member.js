import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { or } from 'ember-decorators/object/computed';

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

  @computed('member.country')
  countrySentence(country) {
    return countryToSentence(country);
  },

  @computed('member.nationality')
  nationalitySentence(nationality) {
    return countryToSentence(nationality);
  },

  @or('member.countryAlias', 'member.country') countryOrAlias: null,
});
