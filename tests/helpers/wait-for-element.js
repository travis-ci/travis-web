import { run } from '@ember/runloop';
import $ from 'jquery';
import { registerAsyncHelper } from '@ember/test';
import Ember from 'ember';

/**
  * Adapted from https://www.snip2code.com/Snippet/94689/waitForElement-Ember-async-helper
  * Avoid use except on events outside Ember that aren’t handled by the built-in test helpers
  * as this slows down the tests.
  */
export default registerAsyncHelper('waitForElement', function (app, element) {
  return Ember.Test.promise(function (resolve) {
    Ember.Test.adapter.asyncStart();
    var interval = setInterval(function () {
      if ($(element).length > 0) {
        clearInterval(interval);
        Ember.Test.adapter.asyncEnd();
        run(null, resolve, true);
      }
    }, 10);
  });
});
