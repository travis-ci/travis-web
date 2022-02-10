import Component from "@ember/component";
import { inject as service } from "@ember/service";
import moment from "moment";

// const buildDataSource = {
//   data: null,
//   caption: {
//     text: "Builds",
//   },
//   yAxis: [
//     {
//       plot: {
//         value: "Total Builds",
//         type: "line",
//         aggregation: "Sum",
//       },
//     },
//   ],
// };

// const minutesDataSource = {
//   data: null,
//   caption: {
//     text: "Minutes",
//   },
//   yAxis: [
//     {
//       plot: {
//         value: "Total Minutes",
//         type: "line",
//         aggregation: "Sum",
//       },
//     },
//   ],
// };

// const creditsDataSource = {
//   data: null,
//   caption: {
//     text: "Credits",
//   },
//   yAxis: [
//     {
//       plot: {
//         value: "Credits Left",
//         type: "line",
//         aggregation: "Sum",
//       },
//     },
//   ],
// };

const dataSource = {
  data: null,
  extensions: {
    standardRangeSelector: {
      enabled: "0",
    },
    customRangeSelector: {
      enabled: "0",
    },
  },
  yAxis: [
    {
      plot: {
        value: "Builds",
        type: "line",
        aggregation: "Sum",
      },
    },
    {
      plot: {
        value: "Minutes",
        type: "line",
        aggregation: "Sum",
      },
    },
    {
      plot: {
        value: "Credits",
        type: "line",
        aggregation: "Sum",
      },
    },
  ],
};

export default Component.extend({
  api: service(),

  title: "Spotlight TimeSeries",
  width: "100%",
  height: 700,
  type: "timeseries",
  dataFormat: null,
  // buildDataSource: null,
  // minutesDataSource: null,
  // creditsDataSource: null,
  dataSource: null,
  timeStart: "2022-01-28",
  timeEnd: "2022-01-31",

  init() {
    this._super(...arguments);
    this.set("dataFormat", "json");
    this.showGraph();
  },

  renderTimeSeries: function (dataSource, container) {
    FusionCharts.ready(() => {
      new FusionCharts({
        type: this.type,
        width: this.width,
        height: this.height,
        renderAt: container,
        dataFormat: this.dataFormat,
        dataSource: dataSource,
      }).render();
    });
  },

  showGraph() {
    const timeStart = encodeURIComponent(this.timeStart);
    const timeEnd = encodeURIComponent(this.timeEnd);

    const path = `/insights_spotlight_summary`;
    const params = `?time_start=${timeStart}&time_end=${timeEnd}`;
    const url = `${path}${params}`;

    return Promise.all([this.api.get(url)]).then((res) => {
      const data = res[0].data;

      const graphData = data.map((item, index) => [
        moment(item.time).format("DD-MMM-YY"),
        item.builds,
        item.minutes,
        item.credits,
        index,
      ]);

      const schema = {
        time: {
          name: "Time",
          type: "date",
          format: "%d-%b-%y",
        },
        builds: {
          name: "Builds",
          type: "number",
        },
        minutes: {
          name: "Minutes",
          type: "number",
        },
        credits: {
          name: "Credits",
          type: "number",
        },
      };

      const fusionDataStore = new FusionCharts.DataStore();
      const fusionDataTable = fusionDataStore.createDataTable(graphData, [
        schema.time,
        schema.builds,
        schema.minutes,
        schema.credits,
      ]);

      dataSource.data = fusionDataTable;

      this.set("dataSource", dataSource);

      this.renderTimeSeries(this.dataSource, "time-series-container");

      // const fusionDataStore1 = new FusionCharts.DataStore();
      // const fusionDataTable1 = fusionDataStore1.createDataTable(
      //   [graphData[0], graphData[1], graphData[4]],
      //   [schema.time, schema.builds]
      // );

      // const fusionDataStore2 = new FusionCharts.DataStore();
      // const fusionDataTable2 = fusionDataStore2.createDataTable(
      //   [graphData[0], graphData[2], graphData[4]],
      //   [schema.time, schema.minutes]
      // );

      // const fusionDataStore3 = new FusionCharts.DataStore();
      // const fusionDataTable3 = fusionDataStore3.createDataTable(
      //   [graphData[0], graphData[3], graphData[4]],
      //   [schema.time, schema.credits]
      // );

      // buildDataSource.data = fusionDataTable1;
      // minutesDataSource.data = fusionDataTable2;
      // creditsDataSource.data = fusionDataTable3;

      // this.set("buildDataSource", buildDataSource);
      // this.set("minutesDataSource", minutesDataSource);
      // this.set("creditsDataSource", creditsDataSource);

      // this.renderTimeSeries(
      //   this.buildDataSource,
      //   "builds-time-series-container"
      // );
      // this.renderTimeSeries(
      //   this.minutesDataSource,
      //   "minutes-time-series-container"
      // );
      // this.renderTimeSeries(
      //   this.creditsDataSource,
      //   "credits-time-series-container"
      // );
    });
  },
});
