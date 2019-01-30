import {
  create,
  collection,
  text,
  isVisible,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/:username/?tab=insights'),

  glances: collection('.insights-grid .insights-glance', {
    name: text('.insights-glance__title'),
    keyStat: text('.insights-glance__stat'),
    percentChange: text('.insights-glance__change-stat > span'),

    chartIsVisible: isVisible('.insights-glance__chart'),
    chartPlaceholderIsVisible: isVisible('.insights-glance__chart-placeholder'),
  }),

  odysseys: collection('.insights-grid .insights-odyssey', {
    name: text('.insights-odyssey__title'),
    chart: text('.insights-odyssey__chart'),
  }),

  noBuildOverlayIsVisible: isVisible('.insights-grid .insights-grid__overlay'),
  noBuildOverlayTitle: text('.insights-grid .insights-grid__overlay h2'),
  noBuildOverlayText: text('.insights-grid .insights-grid__overlay p'),
});
