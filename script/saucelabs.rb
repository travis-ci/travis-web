#!/usr/bin/env ruby

require 'rubygems'
require 'selenium-webdriver'

driver = nil

if ENV['TRAVIS']
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
else
  driver = Selenium::WebDriver.for :chrome
end

driver.navigate.to "http://localhost:5000/spec.html"

driver.execute_script("QUnit.done(function(result) { window.result = result; });")

begin
  result = driver.execute_script('return window.result;')
  sleep 1
end while result.nil?

passed = result["total"] - result["passed"] == 0

driver.quit

raise 'tests failed' unless passed
