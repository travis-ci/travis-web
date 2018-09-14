import { run } from '@ember/runloop';
import $ from 'jquery';
import { registerAsyncHelper } from '@ember/test';
import Ember from 'ember';

/**
  * Adapted from https://www.snip2code.com/Snippet/94689/waitForElement-Ember-async-helper
  * Avoid use except on events outside Ember that aren’t handled by the built-in test helpers
  * as this slows down the tests.
  */

export function waitForElement(element) {
  return Ember.Test.promise(function (resolve) {
    Ember.Test.adapter.asyncStart();
    var interval = setInterval(function () {
      if ($(element).length > 0) {
        console.log('found it!');
        clearInterval(interval);
        Ember.Test.adapter.asyncEnd();
        run(null, resolve, true);
      }
      console.log('didnt find it', element);
    }, 10);
  });
}

registerAsyncHelper('waitForElement', function (app, element) {
  waitForElement(element);
});
