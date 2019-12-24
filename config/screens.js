/* eslint-env node */
'use strict';

const screens = {
  base: { min: 0, units: 'px', prefix: '' },
  sm: { min: 640, units: 'px', prefix: 'sm' },
  md: { min: 768, units: 'px', prefix: 'md' },
  lg: { min: 1024, units: 'px', prefix: 'lg' },
  xl: { min: 1280, units: 'px', prefix: 'xl' },
};

const tailwindScreenConfig = Object.keys(screens).reduce((screenMap, key) => {
  const { min, units } = screens[key];

  if (min !== 0) {
    screenMap[key] = `${min}${units}`;
  }

  return screenMap;
}, {});

module.exports = {
  screens,
  tailwindScreenConfig,
};
