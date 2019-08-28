import { isNone } from '@ember/utils';
import config from 'travis/config/environment';

export const { screens } = config;
export const screenKeys = Object.keys(screens);

export function getResponsiveProp(value) {
  // Cannot destructure from null/undefined
  const saferVal = value || {};

  let { base } = saferVal;
  const { sm, md, lg, xl } = saferVal;

  if (
    isNone(base) &&
    isNone(sm) &&
    isNone(md) &&
    isNone(lg) &&
    isNone(xl)
  ) {
    base = value;
  }

  return {
    base,
    sm,
    md,
    lg,
    xl
  };
}
