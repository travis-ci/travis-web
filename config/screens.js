/* eslint-env node */
'use strict';

module.exports = function () {
  const screens = {
    base: { min: 0, units: 'px', prefix: '', name: 'base' },
    sm: { min: 640, units: 'px', prefix: 'sm', name: 'sm' },
    md: { min: 768, units: 'px', prefix: 'md', name: 'md' },
    lg: { min: 1024, units: 'px', prefix: 'lg', name: 'lg' },
    xl: { min: 1280, units: 'px', prefix: 'xl', name: 'xl' },
  };

  return screens;
};
