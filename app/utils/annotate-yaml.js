export default function annotateYaml(messages = [], yaml) {
  return messages.reduce((annotations, message) => {
    let line = yamlKeyFinder(yaml, searchKeyForMessage(message));

    if (line === 0 || line) {
      annotations.push({
        message, line
      });
    }

    return annotations;
  }, []);
}

function yamlKeyFinder(yaml, key) {
  let lines = yaml.split('\n');

  return key.split('.').reduce((startingLine, subkey) => linesKeyFinder(lines, subkey, startingLine), 0);
}

function linesKeyFinder(lines, key, startingLine) {
  let foundLine = lines.slice(startingLine).findIndex(line => line.match(new RegExp(`^\\s*${key}`)));

  if (foundLine > -1) {
    return foundLine + startingLine;
  } else {
    return null;
  }
}

function searchKeyForMessage(message) {
  let code = message.code;

  if (code === 'empty' || code === 'unknown_key') {
    if (message.key === 'root') {
      return message.args.key;
    } else {
      return `${message.key}.${message.args.key}`;
    }
  } else if (code === 'alias') {
    if (message.key === 'root') {
      return message.args.alias;
    }
  }

  return message.key;
}
