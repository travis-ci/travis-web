import {
  create,
  contains,
  collection,
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

  helpDropdownPresent: contains('nav#navigation ul li span.navigation-anchor'),

  helpLinks: collection({
    itemScope: 'nav#navigation ul li ul.navigation-nested li',
    item: {
      title: text('a'),
    },
  }),

  loginLinkPresent: contains('.auth-button.signed-out', { scope: '.topbar nav#navigation ul li.menu.profile' }),
  broadcastsPresent: contains('.topbar .broadcast span.icon-broadcast.announcement'),
  profileLinkPresent: contains('.navigation-anchor.signed-in', { scope: '.topbar nav#navigation ul li.menu.profile.signed-in' }),
  ctaText: text('.cta p.row'),
});
