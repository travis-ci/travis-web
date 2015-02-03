require 'routes/basic'

AbstractBuildsRoute = Travis.AbstractBuildsRoute

Route = AbstractBuildsRoute.extend(contentType: 'builds')

Travis.BuildsRoute = Route
