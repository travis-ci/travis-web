import Component from '@ember/component';
import { DEFAULT_INSIGHTS_INTERVAL, INSIGHTS_INTERVALS } from 'travis/services/insights';

export const INSIGHTS_TABS = [
  { slug: INSIGHTS_INTERVALS.WEEK, title: INSIGHTS_INTERVALS.WEEK.capitalize() },
  { slug: INSIGHTS_INTERVALS.MONTH, title: INSIGHTS_INTERVALS.MONTH.capitalize() },
];

export default Component.extend({
  tagName: 'ul',
  classNames: ['travistab-nav travistab-nav--insights insights-tabs'],

  selectedTab: DEFAULT_INSIGHTS_INTERVAL,
  setTab: () => {},

  tabs: INSIGHTS_TABS,

  actions: {
    setInsightTab(selection) {
      this.setTab(selection);
    }
  }
});
