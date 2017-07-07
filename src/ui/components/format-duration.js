import timeInWords from "travis/src/utils/time-in-words/util";
import Ember from 'ember';

export const helper = Ember.Helper.helper(function (params) {
  return new Ember.String.htmlSafe(timeInWords(params[0]));
});
