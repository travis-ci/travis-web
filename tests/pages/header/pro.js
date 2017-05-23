import {
  create,
  collection,
  contains,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),
  logoPresent: contains('h1.logo', { scope: '.topbar' }),

  navigationLinks: collection({
    itemScope: 'nav#navigation ul li',
    item: {
      title: text('a'),
    },
  }),

  loginLinkPresent: contains('.auth-button.signed-out', { scope: '.topbar nav#navigation ul li.menu.profile' }),
});
