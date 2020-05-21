import Component from '@ember/component';
import { assert } from '@ember/debug';

export default Component.extend({
  tagName: '',

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    assert('@provider is required for GettingStartedStepsGeneric component', this.provider);
  },
});
