import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  queryParams: {
    offset: {
      refreshModel: true
    }
  },

  titleToken(model) {
    if (model && model.id) {
      return model.get('name') || model.get('login');
    } else {
      return 'Account';
    }
  },

  model(params) {
    const { login } = params;
    let account = this.modelFor('accounts')
      .find(acct => acct.get('login') === login);
    if (account) {
      return Ember.RSVP.hash({
        account,
        repos: this.store.paginated(
          'repo',
          {
            offset: params.offset,
            sort_by: 'name',
            limit: 25,
            custom: {
              owner: login,
              type: 'byOwner',
            },
          },
          {
            filter: (repo) => repo.get('owner') === login,
            sort: 'name',
          }
        ),
      });
    } else {
      return {
        account: {
          login,
          error: true
        }
      };
    }
  },

  serialize(account) {
    if (account && account.get) {
      return {
        login: account.get('login')
      };
    } else {
      return {};
    }
  }
});
