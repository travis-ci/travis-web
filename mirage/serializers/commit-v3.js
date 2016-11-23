import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serializeSingle(commit) {
    let { id } = commit.attrs;
    delete commit.attrs.id;

    const {
      sha,
      ref,
      message,
    } = commit.attrs;

    let response = {
      '@type': 'commit',
      '@representation': 'standard',
      id,
      sha,
      ref,
      message,
    };

    if (commit.author_name) {
      response.author = {
        name: commit.author_name,
        avatar_url: 'https://0.gravatar.com/avatar/abc123',
      };
    }

    if (commit.committer_name) {
      response.committer = {
        name: commit.committer_name,
        avatar_url: 'https://0.gravatar.com/avatar/abc123',
      };
    }

    return response;
  },
});
