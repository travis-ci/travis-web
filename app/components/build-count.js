import Component from '@ember/component';
import { inject as service } from '@ember/service';
// import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import moment from 'moment';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

const intervalMap = {
  day: {
    subInterval: '10min',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
  },
  week: {
    subInterval: '1hour',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
  },
  month: {
    subInterval: '1day',
    tooltipLabelFormat: '%A, %b %e',
  },
};

const apiTimeBaseFormat = 'YYYY-MM-DD HH:mm:ss';
const apiTimeRequestFormat = `${apiTimeBaseFormat} UTC`;
const apiTimeReceivedFormat = `${apiTimeBaseFormat} zz`;

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],

  api: service(),

  token: '',

  options: computed('interval', 'avgBuilds', function () {
    return {
      title: { text: undefined },
      xAxis: { visible: false, type: 'datetime' },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: this.avgBuilds,
          color: '#eaeaea',
          width: 1,
        }],
        labels: [],
        gridLineWidth: 0,
      },
      legend: { enabled: false },
      chart: {
        type: 'spline',
        height: '25%',
        spacing: [5, 5, 5, 5],
      },
      plotOptions: {
        series: {
          color: '#666',
          lineWidth: 1,
          states: {  hover: { lineWidth: 2, halo: { size: 8 } } },
          marker: { enabled: false, radius: 2 },
        },
      },
      tooltip: {
        xDateFormat: intervalMap[this.interval].tooltipLabelFormat,
        outside: true,
        pointFormat: '<span>{series.name}: <b>{point.y}</b></span><br/>',
      },
    };
  }),

  dataRequest: computed('interval', function () {
    const endpoint = '/insights';
    const url = `${endpoint}/metrics`;
    const owner = this.get('owner');
    const interval = this.interval;
    const endTime = moment.utc();
    const startTime = moment.utc().subtract(1, interval);
    const options = {
      stringifyData: false,
      data: {
        subject: 'builds',
        interval: intervalMap[interval].subInterval,
        func: 'sum',
        name: 'count_started',
        owner_type: owner['@type'] === 'user' ? 'User' : 'Organization',
        owner_id: owner.id,
        end_time: endTime.format(apiTimeRequestFormat),
        start_time: startTime.format(apiTimeRequestFormat),
      }
    };

    return ObjectPromiseProxy.create({
      promise: this.get('api').get(url, options).then(response => ({data: response.data})),
    });
  }),

  aggregateData: computed('dataRequest.data', function () {
    const responseData = this.get('dataRequest.data');
    if (responseData) {
      return Object.entries(responseData.values.reduce((timesMap, value) => {
        if (timesMap.hasOwnProperty(value.time)) {
          timesMap[value.time] += value.value;
        } else {
          timesMap[value.time] = value.value;
        }
        return timesMap;
      }, {})).map(([key, val]) => [moment.utc(key, apiTimeReceivedFormat).valueOf(), val]);
    }
  }),

  content: computed('aggregateData', function () {
    // console.log(this.aggregateData);
    if (this.aggregateData) {
      return [{
        name: 'Builds',
        data: this.aggregateData,
      }];
    }
  }),

  isLoading: computed('aggregateData', function () {
    return !this.aggregateData;
  }),

  totalBuilds: computed('aggregateData', function () {
    if (this.aggregateData) {
      return this.aggregateData.reduce((acc, val) => acc + val[1], 0);
    }
  }),

  avgBuilds: computed('aggregateData', 'totalBuilds', function () {
    if (this.aggregateData) {
      return this.totalBuilds / this.aggregateData.length;
    }
  }),

  totalBuildText: computed('totalBuilds', function () {
    if (typeof this.totalBuilds !== 'number') { return '\xa0'; }
    return this.totalBuilds.toLocaleString();
  }),
});
