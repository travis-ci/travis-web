import { computed } from '@ember/object';

export default function truncate(property, chars) {
  return computed(property, function () {
    const value = this.get(property);
    return value ? value.slice(0, chars) : '';
  });
}
