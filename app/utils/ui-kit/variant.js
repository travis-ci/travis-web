import { computed } from '@ember/object';
import { getResponsiveProp } from 'travis/utils/ui-kit/responsive';

export function variantProp(variantDict = {}, defaultVal) {
  return computed('variant', {
    get(key) {
      const { variant } = this;
      const variantDetails = variantDict[variant] || {};
      const { [key]: variantPropVal } = variantDetails;
      const value = variantPropVal || defaultVal;
      return getResponsiveProp(value);
    },
    set(key, value) {
      return getResponsiveProp(value);
    }
  });
}
