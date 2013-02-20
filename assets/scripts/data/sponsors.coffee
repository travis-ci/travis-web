@Travis.SPONSORS = [
  { id: '1', type: 'platinum', url: "http://www.wooga.com", image: "wooga-205x130.png" }
  { id: '2', type: 'platinum', url: "http://bendyworks.com", image: "bendyworks-205x130.png" }
  { id: '3', type: 'platinum', url: "http://cloudcontrol.com", image: "cloudcontrol-205x130.png" }
  { id: '4', type: 'platinum', url: "http://xing.de", image: "xing-205x130.png" }

  { id: '5', type: 'gold', url: "http://heroku.com", image: "heroku-205x60.png" }
  { id: '6', type: 'gold', url: "http://soundcloud.com", image: "soundcloud-205x60.png" }
  { id: '7', type: 'gold', url: "http://nedap.com", image: "nedap-205x60.png" }
  { id: '8', type: 'gold', url: "http://mongohq.com", image: "mongohq-205x60.png" }
  { id: '9', type: 'gold', url: "http://zweitag.de", image: "zweitag-205x60.png" }
  { id: '10', type: 'gold', url: "http://kanbanery.com", image: "kanbanery-205x60.png" }
  { id: '11', type: 'gold', url: "http://ticketevolution.com", image: "ticketevolution-205x60.jpg" }
  { id: '12', type: 'gold', url: "http://plan.io/travis", image: "planio-205x60.png" }

  { id: '13', type: 'silver', link: "<a href=\"http://cobot.me\">Cobot</a><span>: The one tool to run your coworking space</span>" }
  { id: '14', type: 'silver', link: "<a href=\"http://jumpstartlab.com\">JumpstartLab</a><span>: We build developers</span>" }
  { id: '15', type: 'silver', link: "<a href=\"http://evilmartians.com\">Evil Martians</a><span>: Agile Ruby on Rails development</span>" }
  { id: '16', type: 'silver', link: "<a href=\"http://zendesk.com\">Zendesk</a><span>: Love your helpdesk</span>" }
  { id: '17', type: 'silver', link: "<a href=\"http://stripe.com\">Stripe</a><span>: Payments for developers</span>" }
  { id: '18', type: 'silver', link: "<a href=\"http://basho.com\">Basho</a><span>: We make Riak!</span>" }
  { id: '19', type: 'silver', link: "<a href=\"http://thinkrelevance.com\">Relevance</a><span>: We deliver software solutions</span>" }
  { id: '20', type: 'silver', link: "<a href=\"http://mindmatters.de\">Mindmatters</a><span>: Software für Menschen</span>" }
  { id: '21', type: 'silver', link: "<a href=\"http://amenhq.com\">Amen</a><span>: The best and worst of everything</span>" }
  { id: '22', type: 'silver', link: "<a href=\"http://site5.com\">Site5</a><span>: Premium Web Hosting Solutions</span>" }
  { id: '23', type: 'silver', link: "<a href=\"http://www.crowdint.com\">Crowd Interactive</a><span>: Leading Rails consultancy in Mexico</span>" }
  { id: '24', type: 'silver', link: "<a href=\"http://www.atomicobject.com/detroit\">Atomic Object</a><span>: Work with really smart people</span>" }
  { id: '25', type: 'silver', link: "<a href=\"http://codeminer.com.br\">Codeminer</a><span>: smart services for your startup</span>" }
  { id: '26', type: 'silver', link: "<a href=\"http://cloudant.com\">Cloudant</a><span>: grow into your data layer, not out of it</span>" }
  { id: '27', type: 'silver', link: "<a href=\"http://gidsy.com\">Gidsy</a><span>: Explore, organize &amp; book unique things to do!</span>" }
  { id: '28', type: 'silver', link: "<a href=\"http://5apps.com\">5apps</a><span>: Package &amp; deploy HTML5 apps automatically</span>" }
  { id: '29', type: 'silver', link: "<a href=\"http://meltmedia.com\">Meltmedia</a><span>: We are Interactive Superheroes</span>" }
  { id: '30', type: 'silver', link: "<a href=\"http://www.fngtps.com\">Fingertips</a><span> offers design and development services</span>" }
  { id: '31', type: 'silver', link: "<a href=\"http://www.engineyard.com\">Engine Yard</a><span>: Build epic apps, let us handle the rest</span>" }
  { id: '32', type: 'silver', link: "<a href=\"http://malwarebytes.org\">Malwarebytes</a><span>: Defeat Malware once and for all.</span>" }
  { id: '33', type: 'silver', link: "<a href=\"http://readmill.com\">Readmill</a><span>: The best reading app on the iPad.</span>" }
  { id: '34', type: 'silver', link: "<a href=\"http://www.mdsol.com\">Medidata</a><span>: clinical tech improving quality of life</span>" }
  { id: '35', type: 'silver', link: "<a href=\"http://coderwall.com/teams/4f27194e973bf000040005f0\">ESM</a><span>: Japan's best agile Ruby/Rails consultancy</span>" }
  { id: '36', type: 'silver', link: "<a href=\"http://twitter.com\">Twitter</a><span>: instantly connects people everywhere</span>" }
  { id: '37', type: 'silver', link: "<a href=\"http://agileanimal.com\">AGiLE ANiMAL</a><span>: we <3 Travis CI.</span>" }
  { id: '38', type: 'silver', link: "<a href=\"http://tupalo.com\">Tupalo</a><span>: Discover, review &amp; share local businesses.</span>" }
  { id: '39', type: 'silver', link: "<a href=\"http://pivotallabs.com\">Pivotal Labs</a>"}
  { id: '40', type: 'silver', link: "<a href=\"http://fiksu.com\">Fiksu</a>"}
  { id: '41', type: 'silver', link: "<a href=\"http://saucelabs.com\">Sauce Labs</a>"}
  { id: '42', type: 'silver', link: "<a href=\"http://mogotest.com\">Mogotest</a><span>: Never be embarrassed by a visually broken site again.</span>"}
]

@Travis.WORKERS = {
  "jvm-otp1.worker.travis-ci.org":
    name: "Travis Pro"
    url: "http://travis-ci.com"
  "jvm-otp2.worker.travis-ci.org":
    name: "Transloadit"
    url: "http://transloadit.com"
  "ppp1.worker.travis-ci.org":
    name: "Travis Pro"
    url: "http://beta.travis-ci.com"
  "ppp2.worker.travis-ci.org":
    name: "EnterpriseRails"
    url: "http://www.enterprise-rails.com"
  "ppp3.worker.travis-ci.org":
    name: "Alchemy CMS"
    url: "http://alchemy-cms.com/"
  "rails1.worker.travis-ci.org":
    name: "EnterpriseRails"
    url: "http://www.enterprise-rails.com"
  "ruby1.worker.travis-ci.org":
    name: "Engine Yard"
    url: "http://www.engineyard.com"
  "ruby2.worker.travis-ci.org":
    name: "EnterpriseRails"
    url: "http://www.enterprise-rails.com"
  "ruby3.worker.travis-ci.org":
    name: "Railslove"
    url: "http://railslove.de"
  "ruby4.worker.travis-ci.org":
    name: "Engine Yard"
    url: "http://www.engineyard.com"
  "spree.worker.travis-ci.org":
    name: "Spree"
    url: "http://spreecommerce.com"
  "staging.worker.travis-ci.org":
    name: "EnterpriseRails"
    url: "http://www.enterprise-rails.com"
}
