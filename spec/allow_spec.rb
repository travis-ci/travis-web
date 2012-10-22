require 'spec_helper'

describe Travis::Web::Allow do
  example { post('/')    .should_not be_ok }
  example { delete('/')  .should_not be_ok }
  example { put('/')     .should_not be_ok }
  example { patch('/')   .should_not be_ok }
  example { options('/') .should_not be_ok }
  example { head('/')    .should     be_ok }
  example { get('/')     .should     be_ok }
end
