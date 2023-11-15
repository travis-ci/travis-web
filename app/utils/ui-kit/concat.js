import { computed } from '@ember/object';
import { A } from '@ember/array'

export default function concat(...props) {
  return computed(...props, function () {
    let baseData = A(props.reduce((collection, prop) => [...collection, this.get(prop)], []));
    let compacted = A(baseData.compact());
    let withouted = compacted.without('')

    return withouted.join(' ');
  });
}
