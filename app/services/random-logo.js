import Service from '@ember/service';

export default Service.extend({

  init(...args) {
    this._super(args);

    this.logoVariants = [
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
      'TravisCI-Mascot-pride-4',
      'TravisCI-Mascot-pride',
    ];

    this.set('logo', this.randomLogo());
  },

  randomLogo() {
    const logos = this.logoVariants;
    return logos[Math.floor(Math.random() * logos.length)];
  }

});
