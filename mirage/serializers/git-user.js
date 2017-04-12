import { ActiveModelSerializer } from 'ember-cli-mirage';

export default ActiveModelSerializer.extend({
  serializeSingle(user /* , request, options */) {
    const { avatar_url, name } = user.attrs;
    return { avatar_url, name };
  }
});
