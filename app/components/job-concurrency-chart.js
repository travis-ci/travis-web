import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  jobMinutesJSON: Ember.computed('accountName', 'from', 'to', function () {
    return DS.PromiseObject.create({
      promise: fetch(`http://localhost:4567/stats?from=2017-01-01&to=2017-01-31&orgs=${this.get('accountName')}`)
        .then(response => response.json())
    });
  }),

  jobMinutesData: Ember.computed('jobMinutesJSON.content', function () {
    const jobMinutes = this.get('jobMinutesJSON.content');

    const denulled = jobMinutes.map(([a0, a1, a2, a3, a4]) => {
      if (!a2) {
        return [a0, a1, 'not set', a3, a4];
      } else {
        return [a0, a1, a2, a3, a4];
      }
    });

    const infrastructures = denulled.map(([, , queue]) => queue).uniq();

    const slugToInfrastructureCount = denulled.reduce(
      (slugToInfrastructureCount, [organisation, repository, queue, count, averageJobMinutes]) => {
        const slug = `${organisation}/${repository}`;

        if (!slugToInfrastructureCount[slug]) {
          slugToInfrastructureCount[slug] = {};
        }

        slugToInfrastructureCount[slug][queue] = {
          count, averageJobMinutes: (averageJobMinutes < 0 ? 0 : averageJobMinutes)
        };

        return slugToInfrastructureCount;
      }, {});

    const chartColours = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)'
    };

    const ourColours = [
      chartColours.red,
      chartColours.orange,
      chartColours.yellow,
      chartColours.green,
      chartColours.blue
    ];

    const datasets = infrastructures.map((infrastructure, index) => ({
      label: infrastructure,
      backgroundColor: ourColours[index],
      stack: 'Stack 0',
      data: Object.keys(slugToInfrastructureCount).map(slug => {
        const infrastructureObject = slugToInfrastructureCount[slug][infrastructure];
        return infrastructureObject ? infrastructureObject.count : 0;
      })
    }));

    const labels = Object.keys(slugToInfrastructureCount);

    const barChartData = {
      labels,
      datasets
    };

    return {
      type: 'horizontalBar',
      data: barChartData,
      options: {
        title: {
          text: `Job count for ${this.get('accountName')}`,
          display: true
        },
        responsive: true,
        scales: {
          yAxes: [{
            stacked: true
          }]
        }
      }
    };
  })
});
