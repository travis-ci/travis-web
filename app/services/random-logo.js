import Ember from 'ember';

export default Ember.Service.extend({
  logoVariants: [
    'Tessa-1',
    'Tessa-2',
    'Tessa-3',
    'Tessa-4',
    'Tessa-pride-4',
    'Tessa-pride',
    'TravisCI-Mascot-1',
    'TravisCI-Mascot-2',
    'TravisCI-Mascot-3',
    'TravisCI-Mascot-4',
    'TravisCI-Mascot-4',
    'TravisCI-Mascot-pride',
  ],

  init(...args) {
    this._super(args);
    this.set('logo', this.randomLogo());
  },

  randomLogo() {
    const logos = this.get('logoVariants');
    return logos[Math.floor(Math.random() * logos.length)];
  },
});
