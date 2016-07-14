import V2Serializer from 'travis/mirage/serializers/v2';

import Schema from 'ember-cli-mirage/orm/schema';
import Model from 'ember-cli-mirage/orm/model';
import Db from 'ember-cli-mirage/db';
import SerializerRegistry from 'ember-cli-mirage/serializer-registry';

import { belongsTo, hasMany } from 'ember-cli-mirage';

import { module, test } from 'qunit';

module('Integration | Mirage Serializer | V2Serializer', {
  beforeEach() {
    let db = new Db();
    this.schema = new Schema(db);
    this.schema.registerModels({
      book: Model.extend({
        author: belongsTo()
      }),
      author: Model.extend({
        books: hasMany()
      }),
      blogPost: Model.extend()
    });

    const author = this.schema.authors.create({ name: 'Sara Ahmed' });

    author.createBook({ title: 'Willful Subjects' });
    author.createBook({ title: 'On Being Included' });

    this.schema.blogPosts.create({ title: 'Equality Credentials' });

    this.registry = new SerializerRegistry(this.schema, {
      application: V2Serializer
    });
  },

  afterEach() {
    this.schema.db.emptyData();
  }
});

test('it serialises with underscored property keys', function (assert) {
  const books = this.schema.books.all();
  const result = this.registry.serialize(books);

  assert.deepEqual(result, {
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

test('it sideloads included resources', function (assert) {
  const registryWithInclusion = new SerializerRegistry(this.schema, {
    application: V2Serializer,
    author: V2Serializer.extend({
      include: ['books']
    })
  });

  const authors = this.schema.authors.all();
  const result = registryWithInclusion.serialize(authors);

  assert.deepEqual(result, {
    authors: [{
      id: '1',
      book_ids: ['1', '2'],
      name: 'Sara Ahmed'
    }],
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

test('it uses an underscored container key', function (assert) {
  const blogPost = this.schema.blogPosts.find(1);
  const result = this.registry.serialize(blogPost);

  assert.deepEqual(result, {
    blog_post: {
      id: '1',
      title: 'Equality Credentials'
    }
  });
});
