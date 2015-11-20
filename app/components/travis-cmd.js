import Ember from 'ember';
import config from 'travis/config/environment';

let Component = Ember.Component.extend({
  keyboard: Ember.inject.service(),
  auth: Ember.inject.service(),

  classNameBindings: ['visible'],
  classNames: ['travis-cmd'],

  didInsertElement() {
    this.get('keyboard').bind('t', this.show.bind(this));
    this.get('keyboard').bind('esc', 'cmd', this.hide.bind(this));
  },

  show() {
    this.loadSlugs();
    this.set('visible', true);
    this.get('keyboard').setScope('cmd');
  },

  hide() {
    this.set('visible', false);
    this.get('keyboard').setScope(null);
    this.set('matches', null);
    this.set('filterString', null);
    this.set('results', null);
  },

  loadSlugs() {
    this.set('loading', true);

    $.ajax(config.apiEndpoint + '/repos/slugs', {
      headers: {
        Authorization: 'token ' + this.get('auth').token(),
        Accept: 'application/json; version=2'
      }
    }).then((data) => {
      this.set('loading', false);
      this.set('repos', data.repositories);
      this.onLoad();
    });
  },

  onLoad() {
    setTimeout( () => {
      this.$('.input').focus();
    }, 10);
  },

  actions: {
    filterChanged(value) {
      let list = this.get('repos');

      let options = {
          pre: '<strong>'
        , post: '</strong>'
        , extract: function(el) { return el.slug; }
      };

      let results = fuzzy.filter(value, list, options);
      let matches = results.map(function(el) { return el.string; });
      this.set('matches', matches.slice(0, 10).join('<br/>'));
      this.set('results', results);
      this.set('filterString', value);
    },

    keypress(event) {
      if(event.keyCode === 27) {
        this.hide();
      } else if(event.keyCode === 13) {
        let results;
        if(results = this.get('results')) {
          if(results[0]) {
            let slug = results[0].original.slug;
            console.log(slug);
          }
        }
      }
    }
  }
});

export default Component;
