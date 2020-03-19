import { computed } from '@ember/object';

export default function truncate(property, chars) {
  return computed(property, function () {
    return this.get(property).slice(0, chars);
  });
}
