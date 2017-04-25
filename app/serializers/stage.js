import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  attrs: {
    _finishedAt: { key: 'finished_at' },
    _startedAt: { key: 'started_at' }
  }
});
