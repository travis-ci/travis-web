import { Factory } from 'ember-cli-mirage';
import moment from 'moment';

export default Factory.extend({
  name: 'times_waiting',
  interval: '1day',
  time: i => {
    const now = moment.utc();
    return now.subtract((Math.random() * 10 * 3), 'day');
  },
  value: i => Math.round(Math.random() * 100),
});
