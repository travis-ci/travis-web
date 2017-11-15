import $ from 'jquery';
import Tailing from 'travis/utils/tailing';
import ToTop from 'travis/utils/to-top';

export function initialize(app) {
  app.tailing = new Tailing($(window), '#tail', '#log');
  app.toTop = new ToTop($(window), '.to-top', '#log-container');
}

export default {
  name: 'services',
  initialize,
};
