require 'routes/basic'

AbstractBuildsRoute = Travis.AbstractBuildsRoute

Route = AbstractBuildsRoute.extend(contentType: 'branches')

Travis.BranchesRoute = Route
