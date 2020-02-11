import config from 'travis/config/environment';

export const { screens } = config;
export const screenKeys = Object.keys(screens);

export function getResponsiveProp(value) {
  // Cannot destructure from null/undefined
  const saferVal = value || {};

  let { base } = saferVal;
  const { sm, md, lg, xl } = saferVal;

  const keys = Object.keys(saferVal);
  const hasScreenKey = keys.some(key => screenKeys.includes(key));

  if (!hasScreenKey) {
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
