import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import moment from 'moment';

const UTC_START_TIME = moment.utc({ h: 9, m: 0, s: 0 });
const UTC_END_TIME = moment.utc({ h: 23, m: 0, s: 0 });
const DATE_FORMAT = 'LT';

export default Controller.extend({
  auth: service(),

  isLoggedIn: reads('auth.signedIn'),

  startTime: UTC_START_TIME.local().format(DATE_FORMAT),
  endTime: UTC_END_TIME.local().format(DATE_FORMAT),
  timezone: moment.tz(moment.tz.guess()).format('z')

});
