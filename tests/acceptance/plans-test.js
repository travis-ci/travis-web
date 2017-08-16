import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | plans');

test('visiting /plans', function (assert) {
  widthFeature('proVersion');
  visit('/plans');

  andThen(function () {
    assert.equal(currentURL(), '/plans');
    percySnapshot(assert);
  });
});
