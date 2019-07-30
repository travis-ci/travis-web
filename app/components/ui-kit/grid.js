import Component from '@ember/component';
import { computed } from '@ember/object';

const prefix = (prefix, val) => ((val) => `${prefix}-${val}`);
const props = {
  dir: prefix('flex'),
  wrap: prefix('flex'),
  items: prefix('items'),
  justify: prefix('justify'),
  inline: (val) => (val ? 'inline-flex' : 'flex'),
};
const propNames = Object.keys(props);

export default Component.extend({
  classNameBindings: ['defaultClasses'],

  dir: 'row',
  wrap: 'wrap',
  justify: 'between',
  inline: false,

  defaultClasses: computed(...propNames, function () {
    const classes = propNames.reduce((classes, name) => {
      if (typeof this[name] !== 'undefined' && props.hasOwnProperty(name)) {
        const newClass = props[name](this[name]);
        classes.push(newClass);
      }
      return classes;
    }, []);

    return classes.join(' ');
  }),

  base: 1,
});
