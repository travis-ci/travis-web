import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { format as d3format } from 'd3';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],

  isLoading: true,
  isEmpty: false,

  title: '',
  statistic: '',

  delta: 0,
  deltaTitle: '',
  deltaText: '',

  labels: [],
  values: [],
  datasetTitle: 'Data',
  centerline: null,

  showPlaceholder: or('isLoading', 'isEmpty'),

  // Chart component data
  data: computed('values', 'labels', function () {
    return {
      type: 'spline',
      x: 'x',
      columns: [
        ['x', ...this.labels],
        [this.datasetTitle, ...this.values],
      ],
      colors: {
        [this.datasetTitle]: '#666',
      },
    };
  }),

  // Chart component options
  legend: { show: false },
  size: { height: 50 },

  point: {
    r: 0,
    focus: {
      expand: { r: 4 },
    }
  },

  axis: {
    x: {
      type: 'timeseries',
      tick: { format: '%A, %b %e' },
      show: false,
    },
    y: { show: false }
  },

  tooltip: {
    position: (data, width, height, element) => {
      let top = -50;
      let left = (element.getAttribute('width') - width) / 2;
      return ({ top, left });
    },
    format: {
      value: d3format(','),
    }
  },

  grid: computed('centerline', function () {
    const grid = {
      lines: { front: false },
    };
    if (this.centerline) {
      grid.y = {
        lines: [{
          value: this.centerline,
          class: 'insights-glance__centerline',
        }],
      };
    }
    return grid;
  }),
});
