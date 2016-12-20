import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page404 from 'travis/tests/pages/404';

moduleForAcceptance('Acceptance | non existent routes');

test('visiting /some/non-existent/route', function (assert) {
  visit('/some/non-existent/route');

  andThen(() => {
    assert.equal(currentURL(), '/some/non-existent/route');
    assert.equal(page404.errorHeader, '404: Something\'s Missing We\'re sorry! It seems like this page cannot be found.');
  });
});
