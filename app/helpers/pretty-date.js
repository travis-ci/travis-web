/* global moment */
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  let date = new Date(params[0]);
  return new Ember.String.htmlSafe(moment(date).format('MMMM D, YYYY H:mm:ss') || '-');
});
