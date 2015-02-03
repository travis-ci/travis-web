$: << 'lib'
task :update_emojis do
  s = Dir.glob('assets/images/emoji/*.png').map {|png| png.split('/', 4)[3].gsub('.png', '')}.map{|png| "'#{png}'"}.join(", ")
  e = "@EmojiDictionary = [#{s}]"
  File.open("assets/scripts/config/emoij.coffee", "w") {|f| f.write(e) }
end
