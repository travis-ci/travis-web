import TravisSerializer from 'travis/mirage/serializers/travis';

import Schema from 'ember-cli-mirage/orm/schema';
import Model from 'ember-cli-mirage/orm/model';
import Db from 'ember-cli-mirage/db';
import SerializerRegistry from 'ember-cli-mirage/serializer-registry';

import { module, test } from 'qunit';

module('Integration | Serializer | TravisSerializer', {
  beforeEach() {
    let db = new Db();
    this.schema = new Schema(db);
    this.schema.registerModels({
      book: Model.extend(),
      blogPost: Model.extend()
    });

    this.schema.books.create({title: 'Willful Subjects'});
    this.schema.books.create({title: 'On Being Included'});

    this.schema.blogPosts.create({title: 'Equality Credentials'});

    this.registry = new SerializerRegistry(this.schema, {
      application: TravisSerializer
    });
  },

  afterEach() {
    this.schema.db.emptyData();
  }
});

const v3HeaderRequest = {
  requestHeaders: {
    'Travis-API-Version': '3'
  }
};

const v3PathRequest = {
  url: '/v3/something'
};

test('it serialises V2 by default', function(assert) {
  const book = this.schema.books.find(1);
  const result = this.registry.serialize(book);

  assert.deepEqual(result, {
    book: {
      id: '1',
      title: 'Willful Subjects'
    }
  });
});

test('it serialises V2 multi-word keys with an underscore', function(assert) {
  const blogPost = this.schema.blogPosts.find(1);
  const result = this.registry.serialize(blogPost);

  assert.deepEqual(result, {
    blog_post: {
      id: '1',
      title: 'Equality Credentials'
    }
  });
});

test('it serialises a plural V2 response', function(assert) {
  const books = this.schema.books.all();
  const result = this.registry.serialize(books);

  assert.deepEqual(result, {
    books: [
      {
        id: '1',
        title: 'Willful Subjects'
      },
      {
        id: '2',
        title: 'On Being Included'
      }
    ]
  });
});

test('it serialises a singular V3 response when requested via a header or path starting with /v3', function(assert) {
  const book = this.schema.books.find(1);

  const expectedV3Response = {
    '@type': 'book',
    id: '1',
    title: 'Willful Subjects'
  };

  const headerResult = this.registry.serialize(book, v3HeaderRequest);
  assert.deepEqual(headerResult, expectedV3Response, 'expected a V3 request header to produce a V3 response');

  const pathResult = this.registry.serialize(book, v3PathRequest);
  assert.deepEqual(pathResult, expectedV3Response, 'expected a V3 request path to produce a V3 response');
});

test('it serialises a paginated plural V3 response', function(assert) {
  const books = this.schema.books.all();
  const result = this.registry.serialize(books, v3HeaderRequest);

  assert.deepEqual(result, {
    '@type': 'books',
    '@pagination': {
      count: 2
    },
    books: [
      {
        id: '1',
        title: 'Willful Subjects'
      },
      {
        id: '2',
        title: 'On Being Included'
      }
    ]
  });
});
