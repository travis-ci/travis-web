import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { reads, equal, not, and } from '@ember/object/computed';

export default Component.extend({
  classNames: ['insights-overlay'],
  classNameBindings: [
    'isLoading:insights-overlay--loading',
    'showOverlay:insights-overlay--active',
  ],

  insights: service(),

  private: false,
  interval: 'month',

  // Current Interval Build Data
  requestData: task(function* () {
    return yield this.get('insights').getChartData.perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
      {
        calcTotal: true,
        private: this.private,
      }
    );
  }),
  buildData: reads('requestData.lastSuccessful.value'),
  isLoading: reads('requestData.isRunning'),
  isNotLoading: not('isLoading'),
  totalBuilds: reads('buildData.data.count_started.total'),
  hasNoBuilds: equal('totalBuilds', 0),
  showOverlay: and('isNotLoading', 'hasNoBuilds'),

  isMonth: equal('interval', 'month'),
  isWeek: equal('interval', 'week'),

  // Request build data
  didReceiveAttrs() {
    this.get('requestData').perform();
  }
});
