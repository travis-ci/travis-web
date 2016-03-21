import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
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

      $.ajax("https://repos-filter-production.herokuapp.com/filter?phrase="+value, { 
        headers: { "Authorization": "token " + Travis.lookup('service:auth').token() 
      } }).then((response) => {
        let repos = response.repositories;
        repos = repos.sortBy('score').reverse();
        let matches = repos.slice(0, 10).mapBy('match').map( (match) => match.replace(new RegExp('<|>', 'g'), (match) => match === '<' ? '<strong style="font-weight: 1000; color: #a80000">' : '</strong>' ) ).join('<br/>');
        console.log(matches);
        this.set('matches', matches);
      });

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
