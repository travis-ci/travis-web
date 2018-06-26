import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed('subscription')
  isNew(subscription) {
    return !subscription;
  }
});
