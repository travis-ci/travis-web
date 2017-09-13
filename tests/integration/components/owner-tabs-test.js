import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const tabStatesStub = Ember.Service.extend({
  ownerTab: 'repositories'
});

moduleForComponent('owner-tabs', 'Integration | Component | owner tabs', {
  integration: true,

  beforeEach() {
    this.register('service:tab-states', tabStatesStub);
    this.inject.service('tab-states', { as: 'tabStates' });
  },
});

test('it renders all tabs', function (assert) {
  this.render(hbs`{{owner-tabs}}`);

  assert.ok(this.$().find('#tab_repositories').length, 'renders repositories tab');
  assert.ok(this.$().find('#tab_job_queue').length, 'renders job queue tab');
});

test('it marks tab as active based on tabStates service state', function (assert) {
  this.render(hbs`{{owner-tabs}}`);

  assert.ok(this.$().find('#tab_repositories').hasClass('active'), 'marks repositories tab as active');
  assert.notOk(this.$().find('#tab_job_queue').hasClass('active'), 'does not mark job queue tab as active');

  this.set('tabStates.ownerTab', 'job_queue');

  assert.ok(this.$().find('#tab_job_queue').hasClass('active'), 'changes active tab when tabStates.ownerTab changes');
});
