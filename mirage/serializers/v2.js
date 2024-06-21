import { ActiveModelSerializer } from 'miragejs';

export default class V2Serializer extends ActiveModelSerializer {
  serializeIds = 'always';
}
