require 'routes/route'

AbstractBuildsRoute = Travis.AbstractBuildsRoute

Route = AbstractBuildsRoute.extend(contentType: 'builds')

Travis.BuildsRoute = Route
