import Component from '@ember/component';
import { alias } from 'ember-decorators/object/computed';

export default Component.extend({
  tagName: 'li',
  classNames: ['rows', 'my-build'],
  classNameBindings: ['state'],

  @alias('build.state') state: null,
});
