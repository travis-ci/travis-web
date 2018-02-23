import { test, moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { startMirage } from 'travis/initializers/ember-cli-mirage';
import config from 'travis/config/environment';
import wait from 'ember-test-helpers/wait';

moduleForComponent('travis-status', 'Integration | Component | travis-status', {
  integration: true,
  beforeEach() {
    config.statusPageStatusUrl = 'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json';
    this.server = startMirage();
  },

  afterEach() {
    config.statusPageStatusUrl = undefined;
    this.server.shutdown();
  },
});

test('adds incident class to .status-circle', function (assert) {
  this.render(hbs`{{travis-status}}`);

  return wait().then(() => {
    assert.ok(this.$('.status-circle').hasClass('none'), 'status class is set on .status-circle');
  });
});
