require 'pathname'
require 'digest/md5'

module Travis
  class Assets
    class Version
      FILE_NAME = 'public/version'
      SOURCES = %w(AssetFile Gemfile.lock assets)

      def self.update
        new.update
      end

      attr_reader :root

      def initialize(root = nil)
        @root = Pathname.new(root || File.expand_path('.'))
      end

      def read
        file.read
      end

      def update
        @hash = nil
        write(hash)
        hash
      end

      protected

        def file
          root.join(FILE_NAME)
        end

        def write(version)
          file.open('w+') { |f| f.write(version) }
        end

        def hash
          @hash ||= digest.to_s[0..7]
        end

        def digest
          Digest::MD5.new << `ls -lAR #{sources.join(' ')} | awk '{print $5, $6, $7, $9}'`
        end

        def sources
          SOURCES.map do |source|
            source = root.join(source)
            source.to_s if source.exist?
          end.compact
        end
    end
  end
end
