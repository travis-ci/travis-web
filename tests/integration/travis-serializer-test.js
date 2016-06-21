// TODO import the true serializer
import Serializer from 'ember-cli-mirage/serializer';

import { hasMany, belongsTo } from 'ember-cli-mirage';
import Schema from 'ember-cli-mirage/orm/schema';
import Model from 'ember-cli-mirage/orm/model';
import Db from 'ember-cli-mirage/db';
import SerializerRegistry from 'ember-cli-mirage/serializer-registry';
import { module, test } from 'qunit';

const TravisSerializer = Serializer.extend({

});

module('Integration | Serializer | TravisSerializer', {
  beforeEach() {
    let db = new Db();
    this.schema = new Schema(db);
    this.schema.registerModels({
      book: Model.extend()
    });

    this.schema.books.create({title: 'Willful Subjects'});

    this.registry = new SerializerRegistry(this.schema, {
      application: TravisSerializer
    });
  },

  afterEach() {
    this.schema.db.emptyData();
  }
});

test('it serializes', function(assert) {
  const book = this.schema.books.find(1);
  const result = this.registry.serialize(book);

  assert.deepEqual(result, {
    book: {
      id: '1',
      title: 'Willful Subjects'
    }
  });
});
