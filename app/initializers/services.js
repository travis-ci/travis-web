import Tailing from 'travis/utils/tailing';

export function initialize(app) {
  app.tailing = new Tailing(window, '#tail', '#log');
}

export default {
  name: 'services',
  initialize,
};
