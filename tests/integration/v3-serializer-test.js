import V3Serializer from 'travis/mirage/serializers/v3';

import Schema from 'ember-cli-mirage/orm/schema';
import Model from 'ember-cli-mirage/orm/model';
import Db from 'ember-cli-mirage/db';
import SerializerRegistry from 'ember-cli-mirage/serializer-registry';

import { belongsTo, hasMany } from 'ember-cli-mirage';

import { module, test } from 'qunit';

module('Integration | Mirage Serializer | V3Serializer', {
  beforeEach() {
    let db = new Db();
    this.schema = new Schema(db);
    this.schema.registerModels({
      book: Model.extend({
        author: belongsTo()
      }),
      author: Model.extend({
        books: hasMany()
      })
    });

    const author = this.schema.authors.create({name: 'Sara Ahmed'});

    author.createBook({title: 'Willful Subjects'});
    author.createBook({title: 'On Being Included'});

    this.registry = new SerializerRegistry(this.schema, {
      application: V3Serializer
    });
  },

  afterEach() {
    this.schema.db.emptyData();
  }
});

test('it serialises a collection with underscored property keys', function(assert) {
  const books = this.schema.books.all();
  const result = this.registry.serialize(books);

  assert.deepEqual(result, {
    '@type': 'books',
    books: [{
      id: '1',
      author_id: '1',
      title: 'Willful Subjects'
    }, {
      id: '2',
      author_id: '1',
      title: 'On Being Included'
    }]
  });
});

test('it serialises a single resource with its properties included directly', function(assert) {
  const book = this.schema.books.find(1);
  const result = this.registry.serialize(book);

  assert.deepEqual(result, {
    '@type': 'book',
    id: '1',
    author_id: '1',
    title: 'Willful Subjects'
  });
});
