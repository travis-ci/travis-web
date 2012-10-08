@Travis.SPONSORS = [
  { type: 'platinum', url: "http://www.wooga.com", image: "wooga-205x130.png" }
  { type: 'platinum', url: "http://bendyworks.com", image: "bendyworks-205x130.png" }
  { type: 'platinum', url: "http://cloudcontrol.com", image: "cloudcontrol-205x130.png" }
  { type: 'platinum', url: "http://xing.de", image: "xing-205x130.png" }

  { type: 'gold', url: "http://heroku.com", image: "heroku-205x60.png" }
  { type: 'gold', url: "http://soundcloud.com", image: "soundcloud-205x60.png" }
  { type: 'gold', url: "http://nedap.com", image: "nedap-205x60.png" }
  { type: 'gold', url: "http://mongohq.com", image: "mongohq-205x60.png" }
  { type: 'gold', url: "http://zweitag.de", image: "zweitag-205x60.png" }
  { type: 'gold', url: "http://kanbanery.com", image: "kanbanery-205x60.png" }
  { type: 'gold', url: "http://ticketevolution.com", image: "ticketevolution-205x60.jpg" }
  { type: 'gold', url: "http://plan.io/travis", image: "planio-205x60.png" }

  { type: 'silver', link: "<a href=\"http://cobot.me\">Cobot</a><span>: The one tool to run your coworking space</span>" }
  { type: 'silver', link: "<a href=\"http://jumpstartlab.com\">JumpstartLab</a><span>: We build developers</span>" }
  { type: 'silver', link: "<a href=\"http://evilmartians.com\">Evil Martians</a><span>: Agile Ruby on Rails development</span>" }
  { type: 'silver', link: "<a href=\"http://zendesk.com\">Zendesk</a><span>: Love your helpdesk</span>" }
  { type: 'silver', link: "<a href=\"http://stripe.com\">Stripe</a><span>: Payments for developers</span>" }
  { type: 'silver', link: "<a href=\"http://basho.com\">Basho</a><span>: We make Riak!</span>" }
  { type: 'silver', link: "<a href=\"http://thinkrelevance.com\">Relevance</a><span>: We deliver software solutions</span>" }
  { type: 'silver', link: "<a href=\"http://mindmatters.de\">Mindmatters</a><span>: Software für Menschen</span>" }
  { type: 'silver', link: "<a href=\"http://amenhq.com\">Amen</a><span>: The best and worst of everything</span>" }
  { type: 'silver', link: "<a href=\"http://site5.com\">Site5</a><span>: Premium Web Hosting Solutions</span>" }
  { type: 'silver', link: "<a href=\"http://www.crowdint.com\">Crowd Interactive</a><span>: Leading Rails consultancy in Mexico</span>" }
  { type: 'silver', link: "<a href=\"http://www.atomicobject.com/detroit\">Atomic Object</a><span>: Work with really smart people</span>" }
  { type: 'silver', link: "<a href=\"http://codeminer.com.br\">Codeminer</a><span>: smart services for your startup</span>" }
  { type: 'silver', link: "<a href=\"http://cloudant.com\">Cloudant</a><span>: grow into your data layer, not out of it</span>" }
  { type: 'silver', link: "<a href=\"http://gidsy.com\">Gidsy</a><span>: Explore, organize &amp; book unique things to do!</span>" }
  { type: 'silver', link: "<a href=\"http://5apps.com\">5apps</a><span>: Package &amp; deploy HTML5 apps automatically</span>" }
  { type: 'silver', link: "<a href=\"http://meltmedia.com\">Meltmedia</a><span>: We are Interactive Superheroes</span>" }
  { type: 'silver', link: "<a href=\"http://www.fngtps.com\">Fingertips</a><span> offers design and development services</span>" }
  { type: 'silver', link: "<a href=\"http://www.engineyard.com\">Engine Yard</a><span>: Build epic apps, let us handle the rest</span>" }
  { type: 'silver', link: "<a href=\"http://malwarebytes.org\">Malwarebytes</a><span>: Defeat Malware once and for all.</span>" }
  { type: 'silver', link: "<a href=\"http://readmill.com\">Readmill</a><span>: The best reading app on the iPad.</span>" }
  { type: 'silver', link: "<a href=\"http://www.mdsol.com\">Medidata</a><span>: clinical tech improving quality of life</span>" }
  { type: 'silver', link: "<a href=\"http://coderwall.com/teams/4f27194e973bf000040005f0\">ESM</a><span>: Japan's best agile Ruby/Rails consultancy</span>" }
  { type: 'silver', link: "<a href=\"http://twitter.com\">Twitter</a><span>: instantly connects people everywhere</span>" }
  { type: 'silver', link: "<a href=\"http://agileanimal.com\">AGiLE ANiMAL</a><span>: we <3 Travis CI.</span>" }
  { type: 'silver', link: "<a href=\"http://tupalo.com\">Tupalo</a><span>: Discover, review &amp; share local businesses.</span>" }
]

@Travis.WORKERS = {
  "jvm-otp1.worker.travis-ci.org":
    name: "Travis Pro"
    url: "http://beta.travis-ci.com"
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
