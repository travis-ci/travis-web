import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Mixin.create({
  polling: service(),

  init() {
    this.set('currentPollModels', {});

    return this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);
    return this.startPolling();
  },

  willDestroyElement() {
    this._super(...arguments);
    return this.stopPolling();
  },

  pollModelDidChange(sender, key, value) {
    return this.pollModel(key);
  },

  pollModel(property) {
    var model = this.get(property),
        currentPollModels = this.get('currentPollModels');

    if(currentPollModels[property]) {
      this.get('polling').stopPolling(currentPollModels[property]);
    }
    currentPollModels[property] = model;

    var addToPolling = () => {
      return this.get('polling').startPolling(model);
    };

    if (model) {
      if (model.then) {
        return model.then(function(resolved) {
          return addToPolling(resolved);
        });
      } else {
        return addToPolling(model);
      }
    }
  },

  stopPollingModel(property) {
    var model = this.get(property);
    if (model) {
      return this.get('polling').stopPolling(model);
    }
  },

  startPolling() {
    var pollModels;
    pollModels = this.get('pollModels');
    if (pollModels) {
      if (!Ember.isArray(pollModels)) {
        pollModels = [pollModels];
      }
      pollModels.forEach( (property) => {
        this.pollModel(property);
        this.addObserver(property, this, 'pollModelDidChange');
      });
    }
    if (this.pollHook) {
      return this.get('polling').startPollingHook(this);
    }
  },

  stopPolling() {
    var pollModels = this.get('pollModels');

    if (pollModels) {
      if (!Ember.isArray(pollModels)) {
        pollModels = [pollModels];
      }
      pollModels.forEach( (property) => {
        this.stopPollingModel(property);
        this.removeObserver(property, this, 'pollModelDidChange');
      });
    }
    return this.get('polling').stopPollingHook(this);
  }
});
