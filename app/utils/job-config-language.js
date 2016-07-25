import { languageConfigKeys } from 'travis/utils/keys-map';

export default function jobConfigLanguage(config) {
  var gemfile, key, languageName, output;
  output = [];

  const completedLanguageNames = [];
  if (config) {
    for (key in languageConfigKeys) {
      languageName = languageConfigKeys[key];
      let version = config[key];
      if (version) {
        output.push(languageName + ': ' + version);
        completedLanguageNames.push(languageName);
      }
    }
    gemfile = config.gemfile;
    if (gemfile && config.env) {
      output.push('Gemfile: ' + gemfile);
    }

    if (config.language) {
      languageName = languageConfigKeys[config.language];

      if (languageName && completedLanguageNames.indexOf(languageName) === -1) {
        output.push(languageConfigKeys[config.language]);
      }
    }
  }
  return output.join(' ');
}
