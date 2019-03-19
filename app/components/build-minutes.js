import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';


export default Component.extend({
  classNames: ['insights-glance-container'],
  private: false,

  insights: service(),

  // Current Interval Chart Data
  requestData: task(function* () {
    return yield this.get('insights').getChartData.perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['times_running'],
      {
        calcAvg: true,
        private: this.private,
        customSerialize: (key, val) => [key, Math.round(val / 60)],
      }
    );
  }),
  chartData: reads('requestData.lastSuccessful.value'),
  buildMins: reads('chartData.data.times_running.plotValues'),
  labels: reads('chartData.labels'),

  isLoading: reads('requestData.isRunning'),
  isEmpty: equal('totalBuildMins', 0),
  showPlaceholder: or('isLoading', 'isEmpty'),

  // Total / average
  totalBuildMins: reads('chartData.data.times_running.total'),
  avgBuildMins: reads('chartData.data.times_running.average'),

  totalBuildText: computed('isLoading', 'totalBuildMins', function () {
    if (this.isLoading || typeof this.totalBuildMins !== 'number') { return '\xa0'; }
    return `
      ${this.totalBuildMins.toLocaleString()}
      ${pluralize(this.totalBuildMins, 'min', {withoutCount: true})}
    `.trim();
  }),

  // Request chart data
  didReceiveAttrs() {
    this.get('requestData').perform();
  }
});
