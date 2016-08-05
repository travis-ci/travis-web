import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Some Feature ${i}`;
  },

  description(i) {
    return `Some Feature ${i} will make Travis so much better!`;
  },

  enabled: false
});
