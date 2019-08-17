import { computed } from '@ember/object';

export default function concat(...props) {
  return computed(...props, function () {
    const results = props.reduce((collection, prop) => {
      const val = this.get(prop);
      if (val !== undefined && val !== null) {
        collection.push(val);
      }
      return collection;
    }, []);

    return results.join(' ');
  });
}
