import Component from '@ember/component';
import { DEFAULT_INSIGHTS_INTERVAL, INSIGHTS_INTERVALS } from 'travis/services/insights';

export const INSIGHTS_TABS = Object.values(INSIGHTS_INTERVALS).map(slug => ({ slug, title: slug.capitalize() }));

export default Component.extend({
  tagName: 'ul',
  classNames: ['travistab-nav travistab-nav--insights insights-tabs'],

  selectedTab: DEFAULT_INSIGHTS_INTERVAL,

  tabs: INSIGHTS_TABS,
});
