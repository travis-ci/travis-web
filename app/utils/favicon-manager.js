import Ember from 'ember';

var manager = function(headTag) {
  if (headTag) {
    this.headTag = headTag;
  }
  return this;
};

manager.prototype.getHeadTag = function() {
  return this.headTag || document.getElementsByTagName('head')[0];
};

manager.prototype.setFavicon = function(href) {
  var head, link, oldLink;
  head = this.getHeadTag();
  oldLink = this.getLinkTag();
  link = this.createLinkTag();
  head.appendChild(link);
  setTimeout(function() {
    return link.setAttribute('href', href);
  }, 10);
  if (oldLink) {
    return head.removeChild(oldLink);
  }
};

manager.prototype.getLinkTag = function() {
  var i, len, link, links;
  links = this.getHeadTag().getElementsByTagName('link');
  if (links.length) {
    for (i = 0, len = links.length; i < len; i++) {
      link = links[i];
      if ((link.getAttribute('rel') || '').trim() === 'icon') {
        return link;
      }
    }
  }
};

manager.prototype.createLinkTag = function() {
  var link;
  link = document.createElement('link');
  link.setAttribute('rel', 'icon');
  link.setAttribute('type', 'image/png');
  return this.getHeadTag().appendChild(link);
};

export default manager;
