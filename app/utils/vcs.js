import { assert } from '@ember/debug';
import config from 'travis/config/environment';

const { providers } = config;

const vcsId = (vcsType) => {
  const availableProvidersRegex = Object.keys(providers).join('|');
  const match = (vcsType || 'github').match(new RegExp(availableProvidersRegex, 'i'));

  assert(`Invalid VCS Type "${vcsType}"`, match[0]);
  return match[0].toLowerCase();
};

const vcsConfig = (vcsType) => (
  providers[vcsId(vcsType)]
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
  const url = vcs.endpoint + vcs.paths[resource];

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
