## Module Report
### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/adapters/build.js` at line 7

```js

// TODO this is a workaround for an infinite loop in Mirage serialising 😞
if (!Ember.testing) {
  includes += ',build.repository';
}
```

### Unknown Global

**Global**: `Ember.Handlebars`

**Location**: `app/helpers/github-commit-link.js` at line 7

```js

import Ember from 'ember';
const { escapeExpression: escape } = Ember.Handlebars.Utils;

export default Helper.extend({
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/controllers/build.js` at line 32

```js
  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/controllers/index.js` at line 21

```js
  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/controllers/repo.js` at line 63

```js
  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/components/broadcast-tower.js` at line 19

```js

    // Acceptance tests will wait for the promise to resolve, so skip in tests
    if (this.get('isOpen') && !Ember.testing) {
      yield new EmberPromise(resolve => later(resolve, 10000));

```

### Unknown Global

**Global**: `Ember.Handlebars`

**Location**: `app/components/build-message.js` at line 7

```js
import Ember from 'ember';

const { escapeExpression: escape } = Ember.Handlebars.Utils;

export default Component.extend({
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/components/dashboard-row.js` at line 26

```js
    this.toggleProperty('dropupIsOpen');

    if (!Ember.testing) {
      later((() => { this.set('dropupIsOpen', false); }), 4000);
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/components/queued-jobs.js` at line 13

```js
  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/components/running-jobs.js` at line 18

```js
  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/components/repository-sidebar.js` at line 46

```js
    }

    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, () => {
        const callback = (record) => record.get('currentBuild');
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/components/top-bar.js` at line 38

```js

  didInsertElement() {
    if (Ember.testing) {
      this._super(...arguments);
      return;
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/controllers/dashboard/builds.js` at line 12

```js
  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/builds/invalid-build-test.js` at line 14

```js

  hooks.beforeEach(function () {
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/builds/invalid-build-test.js` at line 15

```js
  hooks.beforeEach(function () {
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/builds/invalid-build-test.js` at line 16

```js
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
  });
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/builds/invalid-build-test.js` at line 17

```js
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
  });

```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/builds/invalid-build-test.js` at line 21

```js

  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/builds/invalid-build-test.js` at line 22

```js
  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });

```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/owner/not-found-test.js` at line 22

```js
    // Ignore promise rejection.
    // Original exception will fail test on promise rejection.
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/owner/not-found-test.js` at line 23

```js
    // Original exception will fail test on promise rejection.
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
    Ember.Logger.error = () => null;
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/owner/not-found-test.js` at line 24

```js
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
    Ember.Logger.error = () => null;
  });
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/owner/not-found-test.js` at line 25

```js
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
    Ember.Logger.error = () => null;
  });

```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/owner/not-found-test.js` at line 29

```js

  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/owner/not-found-test.js` at line 30

```js
  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });

```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/job/invalid-log-test.js` at line 14

```js

  hooks.beforeEach(function () {
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/job/invalid-log-test.js` at line 15

```js
  hooks.beforeEach(function () {
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/job/invalid-log-test.js` at line 16

```js
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
  });
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/job/invalid-log-test.js` at line 17

```js
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => {};
    Ember.Logger.error = () => null;
  });

```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/job/invalid-log-test.js` at line 21

```js

  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/job/invalid-log-test.js` at line 22

```js
  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });

```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/repo/not-found-test.js` at line 19

```js
    // Ignore promise rejection.
    // Original exception will fail test on promise rejection.
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/repo/not-found-test.js` at line 20

```js
    // Original exception will fail test on promise rejection.
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
    Ember.Logger.error = () => null;
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/repo/not-found-test.js` at line 21

```js
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
    Ember.Logger.error = () => null;
  });
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/repo/not-found-test.js` at line 22

```js
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
    Ember.Logger.error = () => null;
  });

```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/acceptance/repo/not-found-test.js` at line 26

```js

  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/acceptance/repo/not-found-test.js` at line 27

```js
  hooks.afterEach(function () {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  });

```
