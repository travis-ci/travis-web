BasicView = Travis.BasicView

View = BasicView.extend
  classNames: ['flash']
  tagName: 'ul'
  templateName: 'layouts/flash'

Travis.FlashView = View
