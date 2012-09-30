class Travis::Web::App
  module Helpers
    # TODO what's a better name?
    def map_env(env, segment)
      segment = "/#{segment}" unless segment[0] == '/'
      env['PATH_INFO'] = env['PATH_INFO'].gsub(%r(^#{segment}(?:/)), '')
      env['SCRIPT_NAME'] = "#{env['SCRIPT_NAME']}#{segment}"
      env
    end
  end
end
