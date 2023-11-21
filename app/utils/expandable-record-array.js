import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';
import { Promise as EmberPromise } from 'rsvp';

export default ArrayProxy.extend({
  isLoaded: false,
  isLoading: false,

  content: computed('sourceArray.@each.isDeleted', function() {
    let sourceArray = this.get('sourceArray') || [];
    return sourceArray.filter(item => !item.get('isDeleted'));
  }),

  promise: computed(function () {
    if (this.isLoaded) {
      return EmberPromise.resolve(this);
    }

    return new EmberPromise((resolve) => {
      this.addObserver('isLoaded', () => {
        if (this.isLoaded) {
          resolve(this);
          this.removeObserver('isLoaded');
        }
      });
    });
  }),

  load(array) {
    this.set('isLoading', true);
    return array.then(() => {
      this.set('sourceArray', array);
      this.set('isLoading', false);
      this.set('isLoaded', true);
    });
  }
});
