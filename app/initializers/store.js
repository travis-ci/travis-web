// app/initializers/store-initializer.js
import ExtendedStore from 'travis/services/store'; // Adjust the path to your ExtendedStore

export function initialize(application) {
  application.register('service:store', ExtendedStore, { singleton: true, instantiate: true });
}

export default {
  initialize
};
