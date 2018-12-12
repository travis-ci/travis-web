import { Factory } from 'ember-cli-mirage';
import moment from 'moment';

export default Factory.extend({
  time: i => {
    // Generate times increasingly further into the past, by 1 day for each record
    return moment.utc().subtract(i, 'day').toDate();
  },
  // Generate random numbers 0 - 100
  value: i => Math.round(Math.random() * 100),
});
