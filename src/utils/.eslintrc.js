module.exports = {
  rules: {
    // disable func-names for utils as they are mainly a collection
    // of vanilla JS functions. Not sure how to fix yet.
    'func-names': 0,
    // disable function length checks for the time being. These all
    // need refactoring anyway (at some point).
    'max-len': 0
  }
}
