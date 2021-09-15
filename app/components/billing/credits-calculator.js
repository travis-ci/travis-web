import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { os, vmSizes } from 'travis/utils/credits_calculator';

export default Component.extend({
  api: service(),

  os,
  vmSizes,
  users: '',
  builds: [
    { os: {}, vmSize: {}, minutes: '' }
  ],
  configurations: [],

  totalPrice: computed('configurations.[]', function () {
    let sum = 0;
    for (const configuration of this.get('configurations')) {
      sum += configuration.price;
    }

    return sum;
  }),

  totalCredits: computed('configurations.[]', function () {
    let sum = 0;
    for (const configuration of this.get('configurations')) {
      sum += configuration.credits;
    }

    return sum;
  }),

  calculate() {
    let data = {
      users: this.users,
      executions: []
    };
    for (const build of this.builds) {
      if (build.os.value !== undefined && build.vmSize.value !== undefined && build.minutes.length > 0) {
        data.executions.push({
          os: build.os.value,
          instance_size: build.vmSize.value,
          minutes: build.minutes
        });
      }
    }

    if (data.users.length === 0 || data.executions.length === 0) {
      return;
    }

    this.api.post('/credits_calculator', { data })
      .then((result) => {
        this.get('configurations').clear();
        for (const creditResult of result.credits_results) {
          let config = {
            credits: creditResult.credits,
            price: creditResult.price
          };

          if (creditResult.users !== null) {
            config.name = `${creditResult.users} Users`;
          } else {
            let selectedOs = '';
            for (const system of os) {
              if (system.value === creditResult.os) {
                selectedOs = system.name;
                break;
              }
            }

            let selectedVmSize = '';
            for (const size of vmSizes) {
              if (size.value === creditResult.instance_size) {
                selectedVmSize = size.shortName;
                break;
              }
            }

            config.name = `${creditResult.minutes} Mins, ${selectedOs} Builds, ${selectedVmSize} VM`;
          }

          this.get('configurations').pushObject(config);
        }
      });
  },

  addBuild() {
    this.get('builds').pushObject({ os: {}, vmSize: {}, minutes: '' });
  },

  actions: {
    updateAttribute(buildIndex, attributeName, attribute) {
      this.set(`builds.${buildIndex}.${attributeName}`, attribute);
      this.calculate();
    },

    setUsers(value) {
      this.set('users', value);
      this.calculate();
    },

    addBuild() {
      this.addBuild();
    },

    close() {
      this.hideCalculator();
      this.get('builds').clear();
      this.addBuild();
      this.set('users', '');
    },

  },
});
