import { ActiveModelSerializer } from 'miragejs';

export default ActiveModelSerializer.extend({
  serializeIds: 'always',
});
