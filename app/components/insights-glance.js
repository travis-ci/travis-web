import Component from '@ember/component';
import { computed, isPresent } from '@ember/object';
import { or } from '@ember/object/computed';
import { format as d3format } from 'd3';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading', 'isReverseDeltaColors:insights-glance--reverse-delta-colors'],

  isLoading: true,
  isEmpty: false,
  isReverseDeltaColors: false,

  title: '',
  statistic: '',

  delta: 0,
  deltaTitle: '',
  deltaText: '',
  labels: [],
  values: [],

  labelsx: computed({
    get() {
      if(isPresent(this._labels)) {
        return this._labels;
      }
      return [];
    },
    set(k,v) {
      console.log("SETL");
      console.log(v);
      if(v === undefined) v=[];
      this._labels = v;
      console.log(this._labels);
      return this._labels;
    }
  }),
  valuesx: computed({
    get() {
      if(isPresent(this._values)) {
        return this._values;
      }
      return [];
    },
    set(k,v) {
      if(v === undefined) v=[];
      this._values = v;
      return this._values;
    }
  }),
  datasetTitle: 'Data',
  centerline: null,

  showPlaceholder: or('isLoading', 'isEmpty'),

  // Chart component data
  data: computed( 'datasetTitle', function () {
    console.log("DATA");
    if(this.labels === undefined) this.labels= [];
    if(this.values === undefined) this.values= [];

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
  legend: computed(() => ({ show: false })),
  size: computed(() => ({ height: 50 })),

  point: computed(() => ({
    r: 0,
    focus: {
      expand: { r: 4 },
    }
  })),

  axis: computed(() => ({
    x: {
      type: 'timeseries',
      tick: { format: '%A, %b %e' },
      show: false,
    },
    y: { show: false }
  })),

  tooltip: computed(() => ({
    position: (data, width, height, element) => {
      let top = -50;
      let left = (element.getAttribute('width') - width) / 2;
      return ({ top, left });
    },
    format: {
      value: d3format(','),
    }
  })),

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
