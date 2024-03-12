import { ActiveModelSerializer } from 'miragejs';

export default ActiveModelSerializer.extend({
  serializeSingle(user /* , request, options */) {
    return {
      avatar_url: user.attrs.avatar_url,
      name: user.attrs.name,
    };
  },
});
