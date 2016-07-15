/* globals HS */
import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'a',
  classNames: ['helpscout-link'],
  attributeBindings: ['href', 'title'],
  href: 'mailto:support@travis-ci.com',
  title:'Ask Travis CI support for help',

  click: (event) => {
    event.preventDefault();
    HS.beacon.open();
  }
});
