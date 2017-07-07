// need index here ???
import Resolver from 'ember-resolver/resolvers/glimmer-wrapper/index';
import buildResolverConfig from 'ember-resolver/ember-config';
import config from '../config/environment';

export default Resolver.extend({
  config: buildResolverConfig(config.modulePrefix)
});
