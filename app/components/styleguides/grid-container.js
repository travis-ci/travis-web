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

  base: 1,
  sm: null,
  md: null,
  lg: null,
  xl: null,
});
