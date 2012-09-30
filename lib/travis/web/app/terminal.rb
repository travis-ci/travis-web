class Travis::Web::App
  module Terminal
    def announce(config)
      config.each do |key, value|
        $stderr.puts("#{key.upcase.rjust(15)} = #{colorize(config.send(key))}")
      end
    end

    def colorize(value)
      case value
        when nil, false, '0' then "\e[31m0\e[0m"
        when true, '1'       then "\e[32m1\e[0m"
        else "\e[33m#{value}\e[0m"
      end
    end
  end
end
