import Component from '@ember/component';
import { computed } from '@ember/object';

const props = {
  wrap: (val) => `flex-${val}`,
  inline: (val) => (val ? 'inline-flex' : 'flex'),
};
const propNames = Object.keys(props);

export default Component.extend({
  classNameBindings: ['baseClasses'],

  wrap: 'wrap',
  inline: false,

  baseClasses: computed(...propNames, function () {
    const classes = propNames.reduce((classes, name) => {
      if (typeof this[name] !== 'undefined' && props.hasOwnProperty(name)) {
        const newClass = props[name](this[name]);
        classes.push(newClass);
      }
      return classes;
    }, []);

    return classes.join(' ');
  }),
});
