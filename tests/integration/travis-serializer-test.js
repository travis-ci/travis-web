// TODO import the true serializer
import Serializer from 'ember-cli-mirage/serializer';

import { hasMany, belongsTo } from 'ember-cli-mirage';
import Schema from 'ember-cli-mirage/orm/schema';
import Model from 'ember-cli-mirage/orm/model';
import Db from 'ember-cli-mirage/db';
import SerializerRegistry from 'ember-cli-mirage/serializer-registry';
import { module, test } from 'qunit';

const TravisSerializer = Serializer.extend({
  serialize(response, request) {
    // FIXME is there a way to call Serializer.serialize without this.super?
    let result = this._serializeModel(response, request);

    if (this._requestIsForV3(request)) {
      result['@type'] = response.modelName;
      return result;
    } else {
      const wrappedResult = {};
      wrappedResult[response.modelName] = result;
      return wrappedResult;
    }
  },

  _requestIsForV3(request) {
    if (!request) {
      return false;
    }

    return this._requestHasV3Header(request) || this._requestHasV3Path(request);
  },

  _requestHasV3Header(request) {
    return request.requestHeaders && request.requestHeaders['Travis-API-Version'] === '3';
  },

  _requestHasV3Path(request) {
    return request.url && request.url.indexOf('/v3') === 0;
  }
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

test('it serialises V3 when requested via a header or path starting with /v3', function(assert) {
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
