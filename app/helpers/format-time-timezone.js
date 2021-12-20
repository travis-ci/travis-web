import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper((params) => {
  let [time, format, timeZone] = params;
  if (time) {
    return moment.tz(time, timeZone).format(format);
  } else return 'None';
});
