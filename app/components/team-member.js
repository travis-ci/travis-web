import Ember from 'ember';
const { service } = Ember.inject;

const countrySentenceOverrides = {
  newzealand: 'New Zealand',
  occupiedcanada: 'occupied Canada',
  ukswitzerland: 'UK/Switzerland'
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

  assetMap: service('asset-map'),

  memberImage: Ember.computed('member.image', function () {
    const image = this.get('member.image');
    return this.get('assetMap').resolve(`/images/team/team-${image}.jpg`);
  }),

  countrySentence: Ember.computed('member.country', function () {
    return countryToSentence(this.get('member.country'));
  }),

  nationalitySentence: Ember.computed('member.nationality', function () {
    return countryToSentence(this.get('member.nationality'));
  })
});
