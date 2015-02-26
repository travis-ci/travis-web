`import Ember from 'ember'`

manager = (headTag) ->
  @headTag = headTag if headTag

  return this

manager.prototype.getHeadTag = ->
  @headTag || document.getElementsByTagName('head')[0]

manager.prototype.setFavicon = (href) ->
  head = @getHeadTag()

  oldLink = @getLinkTag()

  link = @createLinkTag()
  head.appendChild(link)

  setTimeout ->
    link.setAttribute('href', href)
  , 10

  if oldLink
    head.removeChild(oldLink)

manager.prototype.getLinkTag = ->
  links = @getHeadTag().getElementsByTagName('link')
  if links.length
    for link in links
      if (link.getAttribute('rel') || '').trim() == 'icon'
        return link

manager.prototype.createLinkTag = ->
  link = document.createElement('link')
  link.setAttribute('rel', 'icon')
  link.setAttribute('type', 'image/png')
  @getHeadTag().appendChild(link)

`export default manager`
