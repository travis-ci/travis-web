`import Ember from 'ember'`
`import { gravatarImage } from 'travis/utils/urls'`

BuildsItemComponent = Ember.Component.extend
  classNameBindings: ['build.state']
  classNames: ['tile', 'tile--small', 'tile--build', 'row']

  urlAuthorGravatarImage: (->
    gravatarImage(@get('build.commit.authorEmail'), 40)
  ).property('build.commit.authorEmail')

`export default BuildsItemComponent`
