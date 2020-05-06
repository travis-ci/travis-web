import Component from '@ember/component';
import { computed } from '@ember/object';
import URL from 'url';

export default Component.extend({
  tagName: 'span',
  classNames: ['avatar-wrapper'],

  userInitials: computed('name', function () {
    let name = this.name;
    if (name) {
      let arr = name.split(' ');
      let initials = '';

      if (arr.length >= 2) {
        initials = arr[0].split('')[0] + arr[1].split('')[0];
      } else {
        initials = arr[0].split('')[0];
      }
      return initials;
    }
  }),

  avatarUrl: computed('url', 'size', function () {
    let url;
    let size = this.size;
    if (!size) {
      size = 32;
    }
    try {
      url = new URL(this.url);
    } catch (e) {
      return `${this.url}?v=3&s=${size}`; // relative image address
    }
    url.searchParams.set('v', '3');
    url.searchParams.set('s', size);
    return url.href;
  }),

  highResAvatarUrl: computed('url', 'size', function () {
    let url;
    let size = this.size;
    if (!size) {
      size = 32;
    }
    size = size * 2; // high-dpi
    try {
      url = new URL(this.url);
    } catch (e) {
      return `${this.url}?v=3&s=${size}`; // relative image address
    }
    url.searchParams.set('v', '3');
    url.searchParams.set('s', size);
    return url.href;
  }),

  showSubscriptionCheckmark: computed(
    'showSubscriptionStatus',
    'account.subscription.isSubscribed',
    'account.education',
    function () {
      let showStatus = this.showSubscriptionStatus;
      let isSubscribed = this.get('account.subscription.isSubscribed');
      let education = this.get('account.education');
      let manualSubscriptionExpired = this.get('account.subscription.manualSubscriptionExpired');
      return showStatus && !manualSubscriptionExpired && (isSubscribed || education);
    }
  ),

  subscriptionTooltipText: computed('account.education', function () {
    let education = this.get('account.education');
    return `This account has an ${education ? 'education' : 'active'} subscription`;
  })
});
