require 'spec_helper'
require 'localeapp-reporter'
require 'localeapp'
describe Localeapp::Reporter do
  let(:hbs_load_path) { File.expand_path '../support/**.hbs', __FILE__ }
  let(:locale_yaml) { File.expand_path '../support/en.yml', __FILE__ }
  let(:reporter) { 
    Localeapp::Reporter.hbs_load_path = Dir[hbs_load_path]
    Localeapp::Reporter.new(locale_yaml) 
  }
 
  it "configures localeapp" do
    reporter
    Localeapp.configuration.translation_data_directory.path.should ==  Dir.new(File.expand_path('../', locale_yaml)).path
  end

  it "supports hbs_load_path at class level" do
    assert_equal Dir[hbs_load_path], reporter.class.hbs_load_path
  end
  
  it "adds missing translations to the Localeapp.missing_translations" do
    reporter.send(:register_missing_translations)
    Localeapp.missing_translations.instance_variable_get('@translations')[:en].keys.should include('missing.key')
  end
 
  it "sends missing translations to localeapp" do
    # have to stub RestClient here as FakeWeb doesn't support looking at the post body yet
    RestClient::Request.should_receive(:execute).with(hash_including(
     :payload => { :translations => Localeapp.missing_translations.to_send }.to_json)).and_return(double('response', :code => 200))

    reporter.send_missing_translations
  end

end
