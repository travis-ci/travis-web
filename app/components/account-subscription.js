import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Component.extend({
  @service store: null,

  @computed()
  subscription() {
    return ObjectPromiseProxy.create({
      promise: this.get('store').findRecord('subscription', 1).catch(() => undefined)
    });
  },
});
