safe = Travis.Helpers.safe

tipsy = (text, tip) ->
  safe '<span class="tool-tip" original-title="' + tip + '">' + text + '</span>'

Travis.Handlebars.tipsy = tipsy
