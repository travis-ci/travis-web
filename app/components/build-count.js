import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({

  options: {

  },

  @computed('data')
  content(data) {
    let filteredData = data.values.reduce((accumulator, value) => {
      if (!accumulator.processedTimes.includes(value.time)) {
        accumulator.processedTimes.push(value.time);
        accumulator.values.push(value);
      }
      return accumulator;
    }, {values: [], processedTimes: []}).values;
    return [{
        name: 'count',
        type: 'spline',
        data: filteredData.map(value => [value.time, value.value]),
      },
    ]
  }
});
