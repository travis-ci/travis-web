import Mixin from '@ember/object/mixin';
import config from 'travis/config/environment';
import { computed } from '@ember/object';

export const VARIANTS = [
  ...Object.values(config.screens).map(screen => screen.prefix),
  'hover'
];

export default Mixin.create({
  classNameBindings: ['tailwindClasses'],

  tailwindProps: computed(() => []),
  variants: computed(() => VARIANTS),
  generatedProps: computed('tailwindProps', 'variants', function () {
    const { tailwindProps, variants } = this;

    if (tailwindProps.length === 0) {
      return [];
    }

    const verifiedProps = variants.reduce(
      (props, variant) => {
        tailwindProps.map(candidate => {
          const propName = variant.length > 0 ? `${variant}:${candidate}` : candidate;

          if (typeof this[propName] !== 'undefined') {
            props.push(propName);
          }
        });

        return props;
      },
      []
    );

    return verifiedProps;
  }),

  tailwindClasses: computed('generatedProps', 'state', function () {
    const { generatedProps } = this;

    if (generatedProps.length === 0) {
      return false;
    }

    const generatedClasses = generatedProps.reduce(
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
