import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Component.extend({
  tagName: 'button',
  classNames: ['showmore-button', 'button'],
  label: 'Show More',
});
