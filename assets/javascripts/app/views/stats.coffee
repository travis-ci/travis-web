@Travis.reopen
  StatsView: Travis.View.extend
    templateName: 'stats/show'
    didInsertElement: ->
      # @renderChart(config) for name, config of @CHARTS

    renderChart: (config) ->
      chart = new Highcharts.Chart(config)
      @fetch config.source, (data) ->
        stats = (config.map(stats) for stats in data.stats)
        chart.series[0].setData(stats)

    fetch: (url, callback) ->
      $.ajax
        type: 'GET'
        url: url
        accepts: { json: 'application/vnd.travis-ci.2+json' }
        success: callback

    CHARTS:
      repos:
        source: '/api/stats/repos'
        total: 0
        map: (data) ->
          [Date.parse(data.date), @total += parseInt(data.count)]
        chart:
          renderTo: "repos_stats"
        title:
          text: "Total Projects/Repositories"
        xAxis:
          type: "datetime"
          dateTimeLabelFormats: # don't display the dummy year
            month: "%e. %b"
            year: "%b"
        yAxis:
          title:
            text: "Count"
          min: 0
        tooltip:
          formatter: ->
            Highcharts.dateFormat("%e. %b", @x) + ": " + @y + " repos"
        series: [
          name: "Repository Growth"
          data: []
        ]

      builds:
        source: '/api/stats/tests'
        map: (data) ->
          [Date.parse(data.date), parseInt(data.count)]
        chart:
          renderTo: "tests_stats"
          type: "column"
        title:
          text: "Build Count"
        subtitle:
          text: "last month"
        xAxis:
          type: "datetime"
          dateTimeLabelFormats: # don't display the dummy year
            month: "%e. %b"
            year: "%b"
        yAxis:
          title:
            text: "Count"
          min: 0
        tooltip:
          formatter: ->
            Highcharts.dateFormat("%e. %b", @x) + ": " + @y + " builds"
        series: [
          name: "Total Builds"
          data: []
        ]
