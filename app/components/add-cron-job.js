import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['form--cron'],
  classNameBindings: ['nameIsBlank:form-error'],
  store: Ember.inject.service(),

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
      "public": null
    });
  },

  actions: {
    save() {
      var env_var, self;
      if (this.get('isSaving')) {
        return;
      }
      this.set('isSaving', true);
      if (this.isValid()) {
        env_var = this.get('store').createRecord('env_var', {
          name: this.get('name'),
          value: this.get('value'),
          "public": this.get('public'),
          repo: this.get('repo')
        });
        self = this;
        return env_var.save().then(() => {
          this.set('isSaving', false);
          return this.reset();
        }, () => {
          return this.set('isSaving', false);
        });
      } else {
        return this.set('isSaving', false);
      }
    },

    nameChanged() {
      return this.set('nameIsBlank', false);
    }
  }
});
