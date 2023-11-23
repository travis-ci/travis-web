import { computed } from '@ember/object';
import { A } from '@ember/array'

export default function concat(...props) {
  return computed(...props, function () {
    let baseData = props.reduce((collection, prop) => [...collection, this.get(prop)], []);
    let compacted = baseData.compact();
    let withouted = A(compacted).without('')

    return withouted.join(' ');
  });
}
