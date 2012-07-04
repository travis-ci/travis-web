$stdout.sync = true

require 'guard'
require 'guard/guard'

module Guard
  class Specs < Guard
    def start
      UI.info "Guard::Specs is running."
      run
    end

    def run_all
      run
    end

    def reload
      run
    end

    def run_on_change(paths)
      puts "change: #{paths.inspect}"
      run
    end

    private

      def run
        system './run_jasmine.coffee public/spec.html'
      end
  end
end



