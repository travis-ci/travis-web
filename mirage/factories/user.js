import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  name: 'Test User',
  email: 'test@travis-ci.com',
  correct_scopes: true,
  login: 'testuser',
  synced_at: '2016-01-01T23:04:31Z',

  withRepository: trait({
    afterCreate(user, server) {
      server.create('repository', {
        owner: {
          login: user.login,
        },
      });
    },
  }),
});
