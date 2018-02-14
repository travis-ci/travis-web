// import { test } from 'qunit';
// import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
// import { enterpriseBanners } from 'travis/tests/pages/enterprise-banner';

// moduleForAcceptance('Acceptance | enterprise/banner', {
//   beforeEach() {
//     const currentUser = server.create('user');
//     signInUser(currentUser);

//     server.get('/v3/enterprise_license', (schema, request) => {
//       return {
//         'license_id': 'ad12345',
//         'seats': '30',
//         'active_users': '21',
//         'license_type': this.licenseType,
//         'expiration_time': this.expirationTime
//       };
//     });
//   }
// });

// test('when the trial has expired', function (assert) {
//   withFeature('enterpriseVersion');
//   this.licenseType = 'trial';
//   this.expirationTime = (new Date(new Date().getTime() - 10000)).toISOString();

//   visit('/');

//   andThen(function () {
//     var done = assert.async();
//     setTimeout(() => {
//       assert.ok(enterpriseBanners.trialBanner.isVisible);
//       assert.equal(enterpriseBanners.trialBanner.text, 'Your trial license has expired, please contact enterprise@travis-ci.com');
//       done();
//     }, 100);
//   });
// });
