import Ember from 'ember';

export default function (elem, text, event = 'keyup') {
  const e = Ember.$.Event(event);
  e.which = 50;
  elem.val(text);
  elem.trigger(e);
}
