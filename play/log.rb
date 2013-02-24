puts 'progress on one same line (faster)'
1.upto(200) do |i|
  print "#{i}|"; sleep(0.025)
end

puts; puts
puts 'progress on one same line (slower)'
1.upto(20) do |i|
  print "#{i}|"; sleep(0.5)
end

puts; puts
puts 'separate lines (faster)'
1.upto(100) do |i|
  puts "line #{i}"; sleep(0.025)
end

puts; puts
puts 'separate lines (faster)'
1.upto(20) do |i|
  puts "line #{i}"; sleep(0.5)
end

codes = {
  fmt: {
    nil => 'no format',
    1 => 'bold',
    3 => 'italic',
    4 => 'underline',
  },
  fg: {
    nil => 'no foreground',
    30 => 'fg-black',
    33 => 'fg-yellow',
    90 => 'fg-grey',
  },
  bg: {
    nil => 'no background',
    40 => 'bg-black',
    41 => 'bg-red',
    42 => 'bg-green',
    44 => 'bg-blue',
    47 => 'bg-white'
  }
}

puts; puts
puts 'ansi'

order  = [:bg, :fg, :fmt]
keys   = codes[order[0]].keys.product(codes[order[1]].keys).product(codes[order[2]].keys)
string = keys.map do |keys|
  keys = keys.flatten
  next if keys[0] == keys[1]
  stuff  = order.zip(keys)
  string = stuff.map { |type, key| codes[type][key] }.join(', ')
  format = stuff.map { |type, key| "\033[#{key}m" if key }.compact.join
  "#{format}#{string}\033[0m"
end.compact.join("\n")

string.scan(/.{1,50}/m).each do |chunk|
  print chunk
  sleep(0.1)
end
