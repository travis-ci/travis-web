import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('orgs-filter', 'Integration | Component | orgs filter', {
  integration: true
});

test('it renders data correctly', function () {
  const orgs = [
    Ember.Object.create({
      id: 'lislis',
      name: 'Lisa P',
      type: 'user',
      avatarUrl: 'https://placekitten.com/200/200',
      reposCount: 4,
      subscribed: false,
      education: false
    }),
    Ember.Object.create({
      id: 'travis-ci',
      name: 'Travis CI',
      type: 'organization',
      avatarUrl: 'https://placekitten.com/200/200',
      reposCount: 23,
      subscribed: true,
      education: false
    })
  ];

  const selectedOrg = null;

  this.set('orgs', orgs);
  this.set('selectedOrg', selectedOrg);
  this.render(hbs`{{orgs-filter orgs=orgs selected=selectedOrg }}`);

  equal(this.$('.option-list').children().length, 2, 'Lists right amount of accounts');
  equal(this.$('.option-display .label-align').text().trim(), 'All accounts', 'Displays right message if no account is selected');
  ok(!this.$().hasClass('is-open'), 'Account list is not open per default');
  this.$('.option-button .option-display').click();

  wait().then(() => {
    ok(this.$().hasClass('is-open'), 'Account list is open after click');
  });

  this.$('.option-list a:first-of-type').click();

  wait().then(() => {
    equal(this.$('.option-list').children().length, 3, 'Lists account and clear filter option if an account is selected');
  });
});
