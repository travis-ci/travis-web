import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

const MIN_ELEVATION = 0;
const MAX_ELEVATION = 4;

export default Component.extend({
  classNames: ['paper-block'],
  classNameBindings: ['elevationClass'],

  title: '',
  elevation: 1,

  @computed('elevation')
  normalizedElevation(elevation) {
    elevation = elevation < MIN_ELEVATION ? MIN_ELEVATION : elevation;
    elevation = elevation > MAX_ELEVATION ? MAX_ELEVATION : elevation;
    return elevation;
  },

  @computed('normalizedElevation')
  elevationClass(normalizedElevation) {
    return `elevation-x${normalizedElevation}`;
  }
});
