import Component from '@ember/component';

export default Component.extend({
  tagName: 'ul',
  classNames: ['travistab-nav travistab-nav--insights'],

  tabs: [
    { slug: 'day', title: 'Day' },
    { slug: 'week', title: 'Week' },
    { slug: 'month', title: 'Month' },
  ]
});
