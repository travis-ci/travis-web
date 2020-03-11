import {
  create,
  collection,
  isPresent,
  isVisible,
  text,
  visitable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/github/:username/?tab=insights'),
  visitWeek: visitable('/github/:username/?tab=insights&timeInterval=week'),

  tabs: {
    clickWeek: clickable('[data-test-insights-period=week]'),
    clickMonth: clickable('[data-test-insights-period=month]'),
  },

  privacySelector: {
    scope: '[data-test-insights-privacy-selector]',
    selected: text('[data-test-insights-privacy-selector-selected]'),
    mainField: text('[data-test-insights-privacy-selector-main-field]'),
  },

  glances: collection('[data-test-insights-glance]', {
    name: text('[data-test-insights-glance-title]'),
    keyStat: text('[data-test-insights-glance-stat]'),
    percentChange: text('[data-test-insights-glance-delta-stat]'),

    chartIsVisible: isVisible('[data-test-insights-glance-chart]'),
    chartPlaceholderIsVisible: isVisible('[data-test-insights-glance-chart-placeholder]'),
  }),

  odysseys: collection('[data-test-insights-odyssey]', {
    name: text('[data-test-insights-odyssey-title]'),
    chart: text('[data-test-insights-odyssey-chart]'),
  }),

  noBuildOverlay: {
    scope: '[data-test-insights-overlay]',
    title: text('[data-test-insights-overlay-title]'),
    text: text('[data-test-insights-overlay-text]'),
    link: {
      scope: '[data-test-insights-overlay-link]',
      text: text(),
      isPresent: isPresent(),
    }
  }
});
