## Travis CI ember web client
[![Build Status](https://travis-ci.org/travis-ci/travis-web.png?branch=master)](https://travis-ci.org/travis-ci/travis-web)
### Running the app

The app is developed using [Ember CLI](http://ember-cli.com). It requires nodejs
with npm installed.

In order to run the app you need to install dependencies with:

    bower install
    npm install

Now you can run the server:

    ember serve

And open http://localhost:4200 in the browser.

Alternatively you can run `ember build --watch` and start the server with `waiter/script/server`

### Running tests

To run a test suite execute:

    ember test

You can also start an interactive test runner for easier development:

    ember test --serve


### Updating the team page

The team information can be found in `app/routes/team.coffee`.  
To add another member just add the info in the same style as the previous ones. Like so

    {
      name: 'Mr T'
      title: 'Mascot'
      handle: 'travisci'
      nationality: 'internet'
      country: 'internet'
      image: 'mrt'
    }

The order of value pairs does not matter, the quotationmarks do. Name and title will be displayed as they are. The handle will be used to generate a link to Twitter and displayed with a '@' in front of it. Nationality and country determine the flags. Please use the name of the country and not the adjective (like 'germany' and NOT 'german'). Image is the identifier to find the right image and animated gif. 'mrt' in the example will result in `team-mrt.png` and `mrt-animated.gif`.  
Add the images themselves to `public/images/team/` and additional flags to `public/images/pro-landing/`. Mind the naming conventions already in place.  
