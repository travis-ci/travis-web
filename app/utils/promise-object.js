import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';

export default function promiseObject(promise) {
  return ObjectProxy.extend(PromiseProxyMixin).create({ promise });
}
