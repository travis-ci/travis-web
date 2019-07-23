import Component from '@ember/component';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

const { screens } = config;
const screenNames = Object.keys(screens);
const gridClassDependencies = [
  'sizePrefix',
  ...screenNames,
  ...screenNames.map(name => `grid.${name}`),
];

export default Component.extend({
  classNameBindings: ['gridClassNames'],

  grid: null,

  sizePrefix: computed('grid.dir', function () {
    return this.grid.dir.includes('col') ? 'h' : 'w';
  }),

  gridClasses: computed(...gridClassDependencies, function () {
    const { grid, sizePrefix } = this;

    const classes = screenNames.reduce((classes, name) => {
      const screenVal = this[name] || grid[name];
      const screenValType = typeof screenVal;
      let size = '';

      if (screenValType === 'string') {
        size = `flex-${screenVal}`;
      } else if (screenValType === 'number') {
        size = `${sizePrefix}-1/${screenVal}`.replace('1/1', 'full');
      } else {
        return classes;
      }

      const screen = screens[name];
      const { prefix } = screen;
      const screenPrefix = prefix.length === 0 ? '' : `${prefix}:`;
      const newClass = `${screenPrefix}${size}`;
      classes.push(newClass);

      return classes;
    }, []);

    return classes;
  }),

  gridClassNames: computed('gridClasses.[]', function () {
    return this.gridClasses.join(' ');
  }),
});
