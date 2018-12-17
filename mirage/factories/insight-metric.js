import { Factory } from 'ember-cli-mirage';
import moment from 'moment';

const valuePool = [20, 40, 60, 80, 100, 10, 20, 15, 10, 4, 20, 69];

export default Factory.extend({
  time: i => {
    // Generate times increasingly further into the past, by 3 days for each record
    return moment.utc().subtract((i * 3), 'day').toDate();
  },
  // Generate value from pool and index, to make test values predictable
  value: i => valuePool[i % valuePool.length],
});
