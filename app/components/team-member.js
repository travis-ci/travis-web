import Ember from 'ember';

const countrySentenceOverrides = {
  ukswitzerland: 'UK/Switzerland',
  occupiedcanada: 'occupied Canada'
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
