import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl'];

const flexify = (val) => `flex-${val}`;
const props = {
  dir: flexify,
  wrap: flexify,
  inline: (val) => (val ? 'inline-flex' : 'flex'),
};
const propNames = Object.keys(props);

export default Component.extend({
  classNameBindings: ['defaultClasses'],

  dir: 'row',
  wrap: 'wrap',
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

  auto: 1,
  base: 1,
  sm: computed('auto', function () {
    return Math.ceil(this.auto / 3);
  }),
  md: computed('auto', function () {
    return Math.ceil(this.auto / 2);
  }),
  lg: reads('auto'),
  xl: reads('auto'),
});
