import { Factory } from 'ember-cli-mirage';
import moment from 'moment';

export default Factory.extend({
  time: i => {
    const time = moment.utc().add((i - 30), 'day');
    return time;
  },
  value: i => Math.round(Math.random() * 100),
});
