import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  attributeBindings: ['title'],

  title: computed('build.{number,state}', function () {
    let number = this.get('build.number');
    let state = this.get('build.state');

    if (number) {
      return `Build #${number} ${state}`;
    } else {
      return '';
    }
  })
});
