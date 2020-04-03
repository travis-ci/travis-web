import Service from '@ember/service';
import { computed } from '@ember/object';

const storage = window.localStorage;

export default Service.extend({
  campaign: storageComputed('travis.utm.campaign'),
  content: storageComputed('travis.utm.content'),
  medium: storageComputed('travis.utm.medium'),
  source: storageComputed('travis.utm.source'),
  term: storageComputed('travis.utm.term')
});

function storageComputed(key) {
  return computed({
    get() {
      return storage.getItem(key) || '';
    },
    set(_, value) {
      if (value) {
        storage.setItem(key, value);
      } else {
        storage.removeItem(key);
      }
      return value;
    }
  });
}
