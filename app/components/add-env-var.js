import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  @service store: null,
  @service raven: null,
  @service flashes: null,

  classNames: ['form--envvar'],
  classNameBindings: ['nameIsBlank:form-error'],

  isValid() {
    if (Ember.isBlank(this.get('name'))) {
      this.set('nameIsBlank', true);
      return false;
    } else {
      return true;
    }
  },

  reset() {
    return this.setProperties({
      name: null,
      value: null,
      'public': null
    });
  },

  save: task(function* () {
    if (this.isValid()) {
      const envVar = this.get('store').createRecord('env_var', {
        name: this.get('name').trim(),
        value: this.get('value').trim(),
        'public': this.get('public'),
        repo: this.get('repo')
      });

      try {
        yield envVar.save().then(saved => saved.set('newlyCreated', true));
        this.reset();
      } catch (e) {
        // eslint-disable-next-line
        this.get('flashes').error('There was an error saving this environment variable.');
        this.get('raven').logException(e);
      }
    }
  }).drop(),

  actions: {
    nameChanged() {
      return this.set('nameIsBlank', false);
    }
  }
});
