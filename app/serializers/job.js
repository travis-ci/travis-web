import JobV2FallbackSerializer from 'travis/serializers/job_v2_fallback';

export default JobV2FallbackSerializer.extend({
  attrs: {
    _config: { key: 'config' }
  }
});
