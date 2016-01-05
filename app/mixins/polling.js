import Ember from 'ember';

export default Ember.Mixin.create({
  polling: Ember.inject.service(),

  didInsertElement() {
    this._super.apply(this, arguments);
    return this.startPolling();
  },

  willDestroyElement() {
    this._super.apply(this, arguments);
    return this.stopPolling();
  },

  pollModelDidChange(sender, key, value) {
    return this.pollModel(key);
  },

  pollModelWillChange(sender, key, value) {
    return this.stopPollingModel(key);
  },

  pollModel(property) {
    var addToPolling, model;
    addToPolling = () => {
      return this.get('polling').startPolling(model);
    };
    if (model = this.get(property)) {
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
    var model;
    if (model = this.get(property)) {
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
        return Ember.addBeforeObserver(this, property, this, 'pollModelWillChange');
      });
    }
    if (this.pollHook) {
      return this.get('polling').startPollingHook(this);
    }
  },

  stopPolling() {
    var pollModels;
    if (pollModels = this.get('pollModels')) {
      if (!Ember.isArray(pollModels)) {
        pollModels = [pollModels];
      }
      pollModels.forEach( (property) => {
        this.stopPollingModel(property);
        this.removeObserver(property, this, 'pollModelDidChange');
        return Ember.removeBeforeObserver(this, property, this, 'pollModelWillChange');
      });
    }
    return this.get('polling').stopPollingHook(this);
  }
});
