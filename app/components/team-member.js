import Ember from 'ember';

const countrySentenceOverrides = {
  newzealand: 'New Zealand',
  occupiedcanada: 'occupied Canada',
  uk: 'United Kingdom',
  ukswitzerland: 'UK/Switzerland',
  usa: 'United States of America'
};

function countryToSentence(country) {
  const override = countrySentenceOverrides[country];

  if (override) {
    return override;
  } else {
    return country.capitalize();
  }
}

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['team-member'],

  countrySentence: Ember.computed('member.country', function () {
    return countryToSentence(this.get('member.country'));
  }),

  nationalitySentence: Ember.computed('member.nationality', function () {
    return countryToSentence(this.get('member.nationality'));
  })
});
