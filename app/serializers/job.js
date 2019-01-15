import JobV2FallbackSerializer from 'travis/serializers/job_v2_fallback';

export default JobV2FallbackSerializer.extend({
  attrs: {
    _finishedAt: { key: 'finished_at' },
    _startedAt: { key: 'started_at' },
    _config: { key: 'config' }
  }
});
