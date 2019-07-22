import Component from '@ember/component';
import { computed } from '@ember/object';

export const MIN_ELEVATION = 0;
export const MAX_ELEVATION = 4;

export default Component.extend({
  classNames: ['paper-block'],
  classNameBindings: ['elevationClass', 'padding::no-padding'],

  title: '',
  elevation: 1,
  padding: true,

  normalizedElevation: computed('elevation', function () {
    let elevation = this.elevation;
    elevation = elevation < MIN_ELEVATION ? MIN_ELEVATION : elevation;
    elevation = elevation > MAX_ELEVATION ? MAX_ELEVATION : elevation;
    return elevation;
  }),

  elevationClass: computed('normalizedElevation', function () {
    let normalizedElevation = this.normalizedElevation;
    return `elevation-x${normalizedElevation}`;
  })
});
