import TravisRoute from 'travis/routes/basic';
import { fetch, Headers } from 'fetch';
import { hash } from 'rsvp';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  @service auth: null,

  model() {
    // FIXME much of this is taken directly from models/log

    let userUrl = `${config.apiEndpoint}/user`;
    let orgsUrl = `${config.apiEndpoint}/orgs`;

    let headers = new Headers({
      'Authorization': `token ${this.get('auth.token')}`,
      'Travis-API-Version': '3'
    });

    // FIXME this ignores errors from either endpoint
    return hash({
      user: fetch(userUrl, {headers}).then(response => response.json()),
      orgs: fetch(orgsUrl, {headers}).then(response => response.json())
    }).then(({user, orgs}) => {
      let models = [];

      models.push(this.store.push({
        data: [{
          id: user.id,
          type: 'user',
          attributes: {
            login: user.login,
            name: user.name,
            avatarUrl: user.avatar_url,
            isSyncing: user.is_syncing,
            syncedAt: user.synced_at
          }
        }]
      })[0]);

      return models.concat(this.store.push({
        data: orgs.organizations.map(org => ({
          id: org.id,
          type: 'organization',
          attributes: {
            login: org.login,
            name: org.name,
            avatarUrl: org.avatar_url,
            isSyncing: org.is_syncing,
            syncedAt: org.synced_at
          }
        }))
      }));
    });
  },

  setupController(controller, model) {
    let orgs, user;
    user = model.filterBy('type', 'user')[0];
    orgs = model.filterBy('type', 'organization');
    controller.set('user', user);
    controller.set('organizations', orgs);
    return controller.set('model', model);
  },
});
