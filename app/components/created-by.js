import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  tagName: '',

  didInsertElement() {
    this._super(...arguments);

    let rawUser = this.get('raw-user');

    // FIXME 😱
    if (rawUser) {
      this.set('user', {
        name: get(rawUser, 'name'),
        login: get(rawUser, 'login'),
        avatarUrl: get(rawUser, 'avatar_url')
      });
    }
  }
});
