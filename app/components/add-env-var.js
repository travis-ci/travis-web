import Ember from 'ember';

const { service } = Ember.inject;
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  classNames: ['form--envvar'],
  classNameBindings: ['nameIsBlank:form-error'],
  store: service(),
  raven: service(),
  flashes: service(),

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
        name: this.get('name'),
        value: this.get('value'),
        'public': this.get('public'),
        repo: this.get('repo')
      });

      try {
        yield envVar.save();
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
