import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { reads, equal } from '@ember/object/computed';

export default Component.extend({
  classNames: ['insights-overlay'],
  classNameBindings: [
    'isLoading:insights-overlay--loading',
    'hasNoBuilds:insights-overlay--active',
  ],
  private: false,

  insights: service(),

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
  totalBuilds: reads('buildData.data.count_started.total'),
  hasNoBuilds: equal('totalBuilds', 0),

  // Request build data
  didReceiveAttrs() {
    this.get('requestData').perform();
  }
});
