import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  classNameBindings: ['tailwindClasses'],

  tailwindProps: computed(() => []),

  tailwindClasses: computed('tailwindProps.[]', function () {
    const { tailwindProps } = this;

    if (tailwindProps.length === 0) {
      return false;
    }

    const generatedClasses = tailwindProps.reduce(
      (classes, propName) => {
        const prop = this[propName];
        const propType = typeof prop;

        if (propType === 'boolean' && prop) {
          classes.push(propName);
        } else if (propType === 'string' || propType === 'number') {
          classes.push(`${propName}-${prop}`);
        }

        return classes;
      },
      []
    );

    return generatedClasses.join(' ');
  }),
});
