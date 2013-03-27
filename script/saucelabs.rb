#!/usr/bin/env ruby

require 'rubygems'
require 'selenium-webdriver'

browser = ENV['BROWSER'].split(':')

caps = Selenium::WebDriver::Remote::Capabilities.send browser[0]
caps.version = browser[1]
caps.platform = browser[2]
caps['tunnel-identifier'] = ENV['TRAVIS_JOB_NUMBER']
caps['name'] = "Travis ##{ENV['TRAVIS_JOB_NUMBER']}"

driver = Selenium::WebDriver.for(
  :remote,
  :url => "http://#{ENV['SAUCE_USERNAME']}:#{ENV['SAUCE_ACCESS_KEY']}@localhost:4445/wd/hub",
  :desired_capabilities => caps)

driver.navigate.to "http://localhost:4000/spec.html"
begin
  status = driver.execute_script('return consoleReporter.status;')
  sleep 1
end while status == 'running'

driver.quit

raise 'tests failed' unless status == 'success'
