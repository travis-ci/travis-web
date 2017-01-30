import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('travis-status', 'TravisStatusComponent', {
  unit: true
});

test('adds incident class to .status-circle', function (assert) {
  assert.expect(3);
  const component = this.subject();
  component.statusPageStatusUrl = 'https://status-url.example.com';
  component.getStatus = function () {
    return new Ember.RSVP.Promise(function (resolve/* , reject*/) {
      return resolve({
        status: {
          indicator: 'major'
        }
      });
    });
  };

  assert.ok(!component.get('status'), 'status is initially not set');
  this.render();
  assert.equal(component.get('status'), 'major', 'status is updated from the API');
  assert.ok(component.$('.status-circle').hasClass('major'), 'status class is set on .status-circle');
});
