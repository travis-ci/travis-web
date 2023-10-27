import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { os, vmSizes } from 'travis/utils/credits_calculator';

export default Component.extend({
  api: service(),

  os,
  vmSizes,
  users: '',
  plans: [],
  builds: [
    { os: {}, vmSize: {}, minutes: '' }
  ],
  configurations: [],
  form: null,
  selectPlan: null,

  bestPlan: computed('totalCredits', 'plans.[]', function () {
    return this.plans.find(item => item.annual === this.isAnnual && item.get('privateCredits') > this.totalCredits);
  }),

  totalPrice: computed('configurations.[]', function () {
    let sum = 0;
    for (const configuration of this.configurations) {
      sum += configuration.price;
    }

    return sum;
  }),

  totalCredits: computed('configurations.[]', function () {
    let sum = 0;
    for (const configuration of this.configurations) {
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
      if (build.os.value !== undefined && parseInt(build.minutes) > 0) {
        let execution = {
          os: build.os.value,
          minutes: build.minutes
        };

        if (build.vmSize && build.vmSize.value) {
          execution.instance_size = build.vmSize.value;
        }

        data.executions.push(execution);
      }
    }

    if (data.users.length === 0 || data.executions.length === 0) {
      return;
    }

    this.api.post('/credits_calculator', { data })
      .then((result) => {
        this.configurations.clear();
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

            config.name = `${creditResult.minutes} Mins, ${selectedOs} Builds`;
            if (creditResult.os !== 'osx') {
              config.name += `, ${selectedVmSize} VM`;
            }
          }

          this.configurations.pushObject(config);
        }
      });
  },

  loadDefaultConfig() {
    this.api.get('/credits_calculator')
      .then((result) => {
        let selectedOs = {};
        for (const system of os) {
          if (system.value === result.os) {
            selectedOs = { name: system.name, value: system.value };
            break;
          }
        }

        let selectedVmSize = {};
        for (const size of vmSizes) {
          if (size.value === result.instance_size) {
            selectedVmSize = { name: size.name, value: size.value };
            break;
          }
        }

        this.builds.clear();
        this.builds.pushObject({ os: selectedOs, vmSize: selectedVmSize, minutes: result.minutes });
        this.set('users', result.users);
        this.calculate();
      });
  },

  addBuild() {
    this.builds.pushObject({ os: {}, vmSize: {}, minutes: '' });
  },

  close() {
    this.hideCalculator();
    this.builds.clear();
    this.addBuild();
    this.set('users', '');
    this.configurations.clear();
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

    loadDefaultConfig() {
      this.loadDefaultConfig();
    },

    selectPlan() {
      this.set('selectedPlan', this.bestPlan);
      this.close();
      this.selectPlan(this.form);
    },

    close() {
      this.close();
    },
  },
});
