import { assert } from '@ember/debug';
import config from 'travis/config/environment';

const {
  providers,
  enterprise: isEnterprise,
  sourceEndpoint
} = config;

export const defaultVcsConfig = Object.values(providers).find(config => config.isDefault);

export const vcsConfig = (vcsType) => (
  Object.values(providers).find(provider => provider.vcsTypes.includes(vcsType)) || defaultVcsConfig
);

export const vcsConfigByUrlPrefix = (urlPrefix) => (
  Object.values(providers).findBy('urlPrefix', urlPrefix)
);

export const vcsConfigByUrlPrefixOrType = (prefixOrType) => {
  let config = vcsConfigByUrlPrefix(prefixOrType);
  if (!config) {
    config = vcsConfig(prefixOrType);
  }
  return config;
};

const replaceParams = (template, params) => (
  Object
    .keys(params)
    .reduce((url, key) => url.replace(`:${key}`, params[key]), template)
);

const templateParams = (template) => {
  const params = template.match(/:[a-zA-Z]+/g);
  return params ? params.map((param) => param.slice(1)) : [];
};

const paramsValid = (template, params) => (
  arrayContainsArray(Object.keys(params), templateParams(template))
);

const arrayContainsArray = (superset, subset) => (
  subset.every((value) => (
    superset.indexOf(value) >= 0
  ))
);

export const vcsUrl = (resource, vcsType, params = {}) => {
  const vcs = vcsConfig(vcsType);
  const endpoint = isEnterprise && sourceEndpoint || vcs.endpoint;
  const url = endpoint + vcs.paths[resource];
  params.vcsId = params.vcsId || params.repo && params.repo.vcsId;

  assert(`Missing url params. URL: ${url}, PARAMS: ${JSON.stringify(params)}`, paramsValid(url, params));
  return replaceParams(url, params);
};

export const vcsName = (vcsType) => vcsConfigByUrlPrefixOrType(vcsType).name;

export const vcsIcon = (vcsType) => vcsConfig(vcsType).icon;

export const vcsVocab = (vcsType, vocabKey) => {
  const vocab = vcsConfig(vcsType).vocabulary[vocabKey];
  if (!vocab) {
    throw new Error(`Invalid vocabulary key: ${vocabKey}`);
  }
  return vocab;
};

export const vcsColor = (vcsType, colorKey) => {
  const config = vcsConfigByUrlPrefixOrType(vcsType);
  const color = config.colors[colorKey];
  if (!color) {
    throw new Error(`Invalid color key: ${colorKey}`);
  }
  return color;
};

export const availableProviders = Object.keys(providers);
