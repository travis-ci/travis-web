import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  name: 'Test User',
  type: 'user',
  email: 'test@travis-ci.com',
  correct_scopes: true,
  login: 'testuser',
  synced_at: '2016-01-01T23:04:31Z',
  is_syncing: false,

  withRepository: trait({
    afterCreate(user, server) {
      server.create('repository', {
        owner: {
          login: user.login,
        },
      });
    },
  }),

  syncing: trait({
    afterCreate(user) {
      user.update({
        is_syncing: true,
        synced_at: null,
      });
      user.save();
    }
  }),
});
