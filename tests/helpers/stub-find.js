import {build} from 'ember-data-factory-guy';

export default function stubFind(server, type, attributes) {
  var data = build(type);

  server.get('/repo/' + data.id, function() {
    return [200, { "Content-Type": "application/json" }, JSON.stringify(data)];
  });

  server.get('/repo/' + data.slug.replace('/', '%2F'), function() {
    return [200, { "Content-Type": "application/json" }, JSON.stringify(data)];
  });

}