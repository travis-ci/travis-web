import Component from '@ember/component';

export default Component.extend({
  tagName: 'ul',
  classNames: ['travistab-nav travistab-nav--insights insight-tabs'],

  selectedTab: 'month',
  setTab: () => {},

  tabs: [
    { slug: 'week', title: 'Week' },
    { slug: 'month', title: 'Month' },
  ],

  actions: {
    setInsightTab(selection) {
      this.setTab(selection);
    }
  }
});
