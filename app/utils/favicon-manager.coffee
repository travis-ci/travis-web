`import Ember from 'ember'`

manager = (headTag) ->
  @headTag = headTag if headTag

  return this

manager.prototype.getHeadTag = ->
  @headTag || document.getElementsByTagName('head')[0]

manager.prototype.setFavicon = (href) ->
  link = @getLinkTag()

  if !link
    oldLink = link
    link = @createLinkTag()
    head = @getHeadTag()
    head.appendChild(link)

  link.setAttribute('href', href)

  if oldLink
    head.removeChild(oldLink)

manager.prototype.getLinkTag = ->
  links = document.getElementsByTagName('head')[0].getElementsByTagName('link')
  if links.length
    for link in links
      if link.getAttribute('rel').trim() == 'icon'
        return link

manager.prototype.createLinkTag = ->
  link = document.createElement('link')
  link.setAttribute('rel', 'icon')
  link.setAttribute('type', 'image/png')
  document.getElementsByTagName('head')[0].appendChild(link)

`export default manager`
