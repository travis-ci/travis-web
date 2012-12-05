log = null
target = null

describe 'Travis.Log', ->
  beforeEach ->
    target = Em.Object.create
      calls: []
      appendLog: (payloads) ->
        lines = payloads.map (p) ->
          line = p.content
          delete p.content
          line

        @get('calls').pushObject
          options: payloads
          lines:   lines

    log = Travis.Log.create(target: target)

  it 'works with log passed as a string', ->
    log.append '1\n2'

    expect( target.get('calls.firstObject.lines') ).toEqual ['1', '2']


  it 'splits lines', ->
    log.append ['1\r\n2\n\n', '3']

    expect( target.get('calls.length') ).toEqual 1
    expect( target.get('calls.firstObject.lines') ).toEqual ['1', '2', '', '3']

  it 'escapes html characters', ->
    log.append '<>'

    expect( target.get('calls.firstObject.lines') ).toEqual ['&lt;&gt;']

  it 'normalizes ansi mess', ->
    log.append ['foo\r\r', 'bar']

    expect( target.get('calls.firstObject.lines') ).toEqual [ 'foo', 'bar' ]

  it 'calls target with folds separation', ->
    fold = Em.Object.create name: 'foo', startPattern: /^\$ foo/, endPattern: /^\$/
    log.addFold fold

    fold = Em.Object.create name: 'qux', startPattern: /^\$ qux/, endPattern: /^\$/
    log.addFold fold

    log.append [
      '1\n', '2\n'
      '$ foo --foo\n', '1\n'
      '$ bar\n'
      '$ baz\n'
      '$ qux\n', '1\n', '2\n'
      '$ end\n'
    ]

    #    expect( target.get('calls.length') ).toEqual 5
    lines   = target.get('calls').map (call) -> call.lines
    options = target.get('calls').map (call) -> call.options

    expect( lines[0] ).toEqual ['1', '2']
    expect( options[0]).toEqual [ { number: 1 }, { number: 2 } ]

    expect( lines[1] ).toEqual ['$ foo --foo', '1']
    expect( options[1]).toEqual [
      { number: 3, fold: 'foo' },
      { number: 4, fold: 'foo', foldContinuation: true, foldEnd: true }]

    expect( lines[2] ).toEqual ['$ bar', '$ baz']
    expect( options[2]).toEqual [{ number: 5 }, { number: 6 }]

    expect( lines[3] ).toEqual ['$ qux', '1', '2']
    expect( options[3]).toEqual [
      { number: 7, fold: 'qux' },
      { number: 8, fold: 'qux', foldContinuation: true },
      { number: 9, fold: 'qux', foldContinuation: true, foldEnd: true }]

    expect( lines[4] ).toEqual ['$ end', '']
    expect( options[4]).toEqual [{ number: 10 }, { number: 11 }]

  it 'works properly when log is started with fold', ->
    fold = Em.Object.create name: 'foo', startPattern: /^\$ foo/, endPattern: /^\$/
    log.addFold fold

    log.append [
      '$ foo --foo\n', '1\n'
      '$ bar\n'
    ]

    expect( target.get('calls.length') ).toEqual 2
    lines   = target.get('calls').map (call) -> call.lines
    options = target.get('calls').map (call) -> call.options

    expect( lines[0] ).toEqual ['$ foo --foo', '1']
    expect( options[0]).toEqual [
      { number: 1, fold: 'foo' },
      { number: 2, fold: 'foo', foldContinuation: true, foldEnd: true }]

    expect( lines[1] ).toEqual ['$ bar', '']
    expect( options[1]).toEqual [{ number: 3 }, { number: 4 }]

  it 'works properly for 2 consecutive folds', ->
    fold = Em.Object.create name: 'foo', startPattern: /^\$ foo/, endPattern: /^\$/
    log.addFold fold

    log.append [
      '$ foo --foo\n', '1\n'
      '$ foo --bar\n', '2\n'
      '$ bar\n'
    ]

    expect( target.get('calls.length') ).toEqual 3
    lines   = target.get('calls').map (call) -> call.lines
    options = target.get('calls').map (call) -> call.options

    expect( lines[0] ).toEqual ['$ foo --foo', '1']
    expect( options[0]).toEqual [
      { number: 1, fold: 'foo' },
      { number: 2, fold: 'foo', foldContinuation: true, foldEnd: true }]

    expect( lines[1] ).toEqual ['$ foo --bar', '2']
    expect( options[1]).toEqual [
      { number: 3, fold: 'foo' },
      { number: 4, fold: 'foo', foldContinuation: true, foldEnd: true }]

    expect( lines[2] ).toEqual ['$ bar', '']
    expect( options[2]).toEqual [{ number: 5 }, { number: 6 }]

  it 'works fine with not finalized fold', ->
    fold = Em.Object.create name: 'foo', startPattern: /^\$ foo/, endPattern: /^\$/
    log.addFold fold

    log.append [
      '$ foo --foo\n', '1\n'
    ]

    expect( target.get('calls.length') ).toEqual 1
    lines   = target.get('calls').map (call) -> call.lines
    options = target.get('calls').map (call) -> call.options

    expect( lines[0] ).toEqual ['$ foo --foo', '1', '']
    expect( options[0]).toEqual  [
      { fold: 'foo', number: 1 },
      { fold: 'foo', number: 2, foldContinuation: true },
      { fold: 'foo', number: 3, foldContinuation: true }]

  it 'allows to continue fold', ->
    fold = Em.Object.create name: 'foo', startPattern: /^\$ foo/, endPattern: /^\$/
    log.addFold fold

    log.append [
      '$ foo --foo\n', '1\n'
    ]

    log.append '2\n'

    log.append [
      '3\n'
      '$ bar\n'
    ]

    expect( target.get('calls.length') ).toEqual 4
    lines   = target.get('calls').map (call) -> call.lines
    options = target.get('calls').map (call) -> call.options

    expect( lines[0] ).toEqual ['$ foo --foo', '1', '']
    expect( options[0]).toEqual  [
      { fold: 'foo', number: 1 },
      { fold: 'foo', number: 2, foldContinuation: true },
      { fold: 'foo', number: 3, foldContinuation: true }]

    expect( lines[1] ).toEqual ['2', '']
    expect( options[1]).toEqual [
      { fold: 'foo', number: 3, foldContinuation: true, append: true }
      { fold: 'foo', number: 4, foldContinuation: true }
    ]

    expect( lines[2] ).toEqual ['3']
    expect( options[2]).toEqual [
      { fold: 'foo', number: 4, foldContinuation: true, append: true, foldEnd: true }
    ]

    expect( lines[3] ).toEqual ['$ bar', '']
    expect( options[3]).toEqual [{ number: 5 }, { number: 6 }]

  it 'notifies that the line should be appended', ->
    log.append '$ foo\n.'

    log.append '...'

    log.append '..\n$ bar\n'

    expect( target.get('calls.length') ).toEqual 3
    lines   = target.get('calls').map (call) -> call.lines
    options = target.get('calls').map (call) -> call.options

    expect( lines[0] ).toEqual ['$ foo', '.']
    expect( options[0]).toEqual  [{ number: 1 }, { number: 2 }]

    expect( lines[1] ).toEqual ['...']
    expect( options[1]).toEqual [{ append: true, number: 2 }]

    expect( lines[2] ).toEqual ['..', '$ bar', '']
    expect( options[2]).toEqual [{ append: true, number: 2 }, { number: 3 }, { number: 4 }]

  it 'notifies that the line should be replaced', ->
    log.append '$ foo\n'

    log.append '\rDownloading 50%'
    log.append '\rDownloading 100%\r\n'

    log.append '$ bar\n'

    expect( target.get('calls.length') ).toEqual 4
    lines   = target.get('calls').map (call) -> call.lines
    options = target.get('calls').map (call) -> call.options

    expect( lines[0] ).toEqual ['$ foo', '']
    expect( options[0]).toEqual  [{ number: 1 }, { number: 2 }]

    expect( lines[1] ).toEqual ['', 'Downloading 50%']
    expect( options[1]).toEqual [{ number: 2, append: true }, { number: 2, replace: true }]

    expect( lines[2] ).toEqual ['', 'Downloading 100%', '']
    expect( options[2]).toEqual [{ number: 2, append: true }, { number: 2, replace: true }, { number: 3 }]

    expect( lines[3] ).toEqual ['$ bar', '']
    expect( options[3]).toEqual [{ number: 3, append: true }, { number: 4 }]

  it 'notifies that the line should be replaced even if carriage return is in the middle', ->

