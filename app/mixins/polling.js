import { isArray } from '@ember/array';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
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

  pollModelDidChange(sender, key) {
    return this.pollModel(key);
  },

  pollModel(property) {
    let model = this.get(property),
      currentPollModels = this.currentPollModels;

    if (currentPollModels[property]) {
      this.polling.stopPolling(currentPollModels[property]);
    }
    currentPollModels[property] = model;

    const addToPolling = () => this.polling.startPolling(model);

    if (model) {
      if (model.then) {
        return model.then(resolved => addToPolling(resolved));
      } else {
        return addToPolling(model);
      }
    }
  },

  stopPollingModel(property) {
    const model = this.get(property);
    if (model) {
      return this.polling.stopPolling(model);
    }
  },

  startPolling() {
    let pollModels;
    pollModels = this.pollModels;
    if (pollModels) {
      if (!isArray(pollModels)) {
        pollModels = [pollModels];
      }
      pollModels.forEach((property) => {
        this.pollModel(property);
        this.addObserver(property, this, 'pollModelDidChange');
      });
    }
    if (this.pollHook) {
      return this.polling.startPollingHook(this);
    }
  },

  stopPolling() {
    let pollModels = this.pollModels;

    if (pollModels) {
      if (!isArray(pollModels)) {
        pollModels = [pollModels];
      }
      pollModels.forEach((property) => {
        this.stopPollingModel(property);
        this.removeObserver(property, this, 'pollModelDidChange');
      });
    }
    return this.polling.stopPollingHook(this);
  }
});
