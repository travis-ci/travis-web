import { isNone } from '@ember/utils';

export default function getResponsiveProp(value) {
  // if (isNone(value)) {
  //   return null;
  // }
  const val = value || {};

  let { base } = val;
  const { sm, md, lg, xl } = val;

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
