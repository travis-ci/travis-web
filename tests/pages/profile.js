import {
  create,
  attribute,
  clickable,
  collection,
  hasClass,
  isPresent,
  text,
  visitable,
  fillable
} from 'ember-cli-page-object';

function existingRepositoriesCollection(scope) {
  return collection(`${scope} li.profile-repolist-item`, {
    name: text('a.profile-repo'),
    isActive: hasClass('active', '.switch-rounded'),
    isDisabled: hasClass('non-admin', 'a.profile-repo'),
    toggle: clickable('.switch-rounded'),
    ariaChecked: attribute('aria-checked', '.switch-rounded'),
    role: attribute('role', '.switch-rounded')
  });
}

function githubAppsRepositoryCollection(scope) {
  return collection(`${scope} li.profile-repolist-item`, {
    name: text('a.profile-repo'),

    isPublic: isPresent('.icon.public'),
    isPrivate: isPresent('.icon.private')
  });
}

export default create({
  visit: visitable('profile/:username'),
  name: text('.profile-header h1'),
  nameBadge: { scope: '.profile-header .badge' },
  login: text('.login'),

  avatar: {
    scope: '.profile-header .avatar-wrapper',

    src: attribute('src', 'img'),
    checkmark: { scope: '.checkmark' }
  },

  subscriptionStatus: {
    scope: '.subscription-status',
    text: text('[data-test-message]')
  },

  filter: fillable('.profile-repositories-filter input.search'),
  noRepositoriesFoundByFilter: text('#administerable-repositories .no-results'),

  notFoundOrgName: text('.page-title .h2--red'),

  administerableRepositories: existingRepositoriesCollection('#administerable-repositories'),

  githubAppsInvitation: {
    scope: '#github-apps-invitation',

    isExpanded: hasClass('expanded'),

    link: {
      scope: 'a',
      href: attribute('href')
    }
  },

  manageGithubAppsLink: {
    scope: '[data-test-github-apps-integration-header] a',
    href: attribute('href')
  },

  migrateGithubAppsButton: { scope: '[data-test-migrate-github-apps]' },

  githubAppsRepositories: githubAppsRepositoryCollection('#github-apps-repositories'),

  notLockedGithubAppsFilter: fillable('.not-locked-profile-repositories-filter input.search'),
  notLockedGithubAppsRepositories: githubAppsRepositoryCollection('#not-locked-github-apps-repositories'),
  notLockedGithubAppsPages: collection('#github-apps-repositories .pagination-navigation [data-test-page-pagination-link]', {
    visit: clickable()
  }),

  lockedGithubAppsRepositories: githubAppsRepositoryCollection('#locked-github-apps-repositories'),

  token: {
    scope: '.profile-user',

    show: clickable('.token-actions button.show-token'),
    value: text('.auth-token'),
    obfuscatedCharacters: text('.obfuscated-chars'),
    tokenCopiedText: text('.token-copied-text'),
  },

  accounts: collection('.profile-aside .account', {
    name: text('.account-name'),
    visit: clickable('.account-name'),

    avatar: {
      scope: '.avatar-wrapper',
      checkmark: { scope: '.checkmark' }
    },
  }),
});
