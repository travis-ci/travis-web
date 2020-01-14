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

const replaceParams = (template, params) => (
  Object
    .keys(params)
    .reduce((url, key) => url.replace(`:${key}`, params[key]), template)
);

const templateParams = (template) => (
  template
    .match(/:[a-z]+/g)
    .map((param) => param.slice(1))
);

const paramsValid = (template, params) => (
  arrayEqual(Object.keys(params), templateParams(template))
);

const arrayEqual = (array1, array2) => (
  array1.sort().toString() === array2.sort().toString()
);

export const vcsUrl = (resource, vcsType, params = {}) => {
  const vcs = vcsConfig(vcsType);
  const endpoint = isEnterprise && sourceEndpoint || vcs.endpoint;
  const url = endpoint + vcs.paths[resource];

  assert(`Missing url params. URL: ${url}, PARAMS: ${JSON.stringify(params)}`, paramsValid(url, params));
  return replaceParams(url, params);
};

export const vcsName = (vcsType) => vcsConfig(vcsType).name;

export const vcsIcon = (vcsType) => vcsConfig(vcsType).icon;

export const vcsVocab = (vcsType, vocabKey) => {
  const vocab = vcsConfig(vcsType).vocabulary[vocabKey];
  if (!vocab) {
    throw new Error(`Invalid vocabulary key: ${vocabKey}`);
  }
  return vocab;
};

export const availableProviders = Object.keys(providers);
