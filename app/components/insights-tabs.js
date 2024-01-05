import Component from '@ember/component';
import { INSIGHTS_INTERVALS } from 'travis/services/insights';
import { capitalize } from '@ember/string';

export const INSIGHTS_TABS = Object.values(INSIGHTS_INTERVALS).map(slug => ({ slug, title: capitalize(slug) }));

export default Component.extend({
  tagName: 'ul',
  classNames: ['travistab-nav travistab-nav--insights insights-tabs'],

  tabs: INSIGHTS_TABS,
});
