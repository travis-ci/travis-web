describe 'Foo', ->
  it 'bar', ->
    console.log('before spec')
    link = $($('#repositories a.slug')[0])
    console.log $('body').html().toString()
    # link.attr('href').should.equal '#/travis-ci/travis-core'
    console.log('after spec')

  it 'bar', ->
    console.log('before spec')
    link = $($('#repositories a.slug')[0])
    # link.attr('href').should.equal '#/travis-ci/travis-core'
    console.log('after spec')

