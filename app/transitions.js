import ENV from 'travis/config/environment'; 
let duration;

if (ENV.environment === 'test') {
  duration = 0;
} else {
  duration = 200;
}

export default function () {
  this.transition(
    this.hasClass('liquid-dialog-container'),
    this.use('explode',
      {
        pick: '.ember-modal-overlay',
        use: ['fade', { duration }]
      },
      {
        pick: '.ember-modal-dialog',
        use: ['fade', { duration }]
      }
    )
  );
}
