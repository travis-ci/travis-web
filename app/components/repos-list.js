import Ember from 'ember';
import KeyboardActionMixin from 'ember-cli-keyboard-actions/mixins/keyboard-actions';

var ReposListComponent = Ember.Component.extend(KeyboardActionMixin, {
  tagName: 'ul',

  keyChordActions: {
    'ctrl.alt.shift': {
      'a': function() {
        debugger
        console.log('MR T');
      }
    }
  },
  keyDownActions: {
    key27: function() {
      console.log('AAAAHHHH');
    }
  },
  doubleClick: function() {
    console.log('##############');
    $('body').toggleClass('cheatcode');
  }
});

export default ReposListComponent;
