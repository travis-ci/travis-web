import { Factory } from 'ember-cli-mirage';
import moment from 'moment';

const valuePool = [20, 40, 60, 80, 100, 10, 20, 15, 10, 4, 20, 69];

export default Factory.extend({
  time: i => {
    // Generate times increasingly further into the past
    // subtract pattern is 0, 1, 1, 3, 6, 9, 12...
    let days;
    switch (i) {
      case 0:
        days = 0;
        break;
      case 1:
        days = 1;
        break;
      case 2:
        days = 1;
        break;
      default:
        days = (i - 2) * 3;
        break;
    }
    return moment.utc().startOf('hour').subtract(days, 'day').toDate();
  },
  // Generate value from pool and index, to make test values predictable
  value: i => valuePool[i % valuePool.length],
});
