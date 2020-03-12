import { computed } from '@ember/object';

export default function concat(...props) {
  return computed(...props, function () {
    return props.reduce((collection, prop) => [...collection, this.get(prop)], []).compact().without('').join(' ');
  });
}
