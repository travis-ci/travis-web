`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  needsAuth: false

  model: () ->
    [
      {
        name: 'Sven Fuchs'
        title: 'The Original Builder'
        handle: 'svenfuchs'
        nationality: 'germany'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Josh Kalderimis'
        title: 'Chief Post-It Officer'
        handle: 'j2h'
        nationality: 'newzealand'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Fritz Thielemann'
        title: 'Admin Adventures'
        handle: 'fritzek'
        nationality: 'germany'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Konstantin Haase'
        title: 'Haase of Pain'
        handle: 'konstantinhaase'
        nationality: 'germany'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Mathias Meyer'
        title: 'Director of Bacon Relations'
        handle: 'roidrage'
        nationality: 'germany'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Piotr Sarnacki'
        title: 'Code Monkey'
        handle: 'drogus'
        nationality: 'poland'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Anika Lindtner'
        title: 'Head Catwoman'
        handle: 'langziehohr'
        nationality: 'germany'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Henrik Hodne'
        title: 'Mac Master Man'
        handle: 'henrikhodne'
        nationality: 'norway'
        country: 'norway'
        image: ''
        gif: ''
      },
      {
        name: 'Justine Arreche'
        title: 'Lead Clipart Strategist'
        handle: 'saltinejustine'
        nationality: 'usa'
        country: 'usa'
        image: ''
        gif: ''
      },
      {
        name: 'Hiro Asari'
        title: 'International Man of IPAs'
        handle: 'hiro_asari'
        nationality: 'japan'
        country: 'usa'
        image: ''
        gif: ''
      },
      {
        name: 'Dan Buch'
        title: 'That\'s Numberwang'
        handle: 'meatballhat'
        nationality: 'usa'
        country: 'usa'
        image: ''
        gif: ''
      },
      {
        name: 'Lisa Passing'
        title: 'Queen of !important'
        nationality: 'germany'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Carla Drago'
        title: 'inchworm'
        handle: 'carlad'
        nationality: 'italy'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Anja Reichmann'
        title: 'Tyranjasaurus Specs'
        handle: '_tyranja_'
        nationality: 'germany'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Aly Fulton'
        title: 'Resident Linguist'
        handle: 'sinthetix'
        nationality: 'usa'
        country: 'usa'
        image: ''
        gif: ''
      },
      {
        name: 'Amanda Quaranto'
        title: 'Crafting Extremist'
        handle: 'aquaranto'
        nationality: 'usa'
        country: 'usa'
        image: ''
        gif: ''
      },
      {
        name: 'Jen Duke'
        title: 'Gastrognome'
        handle: 'dukeofberlin'
        nationality: 'usa'
        country: 'germany'
        image: ''
        gif: ''
      },
      {
        name: 'Brandon Burton'
        title: 'Regional Cloud Manager'
        handle: 'solarce'
        nationality: 'usa'
        country: 'usa'
        image: ''
        gif: ''
      },
      {
        name: 'Emma Trimble'
        title: 'Lead Pungineer'
        handle: 'emdantrim'
        nationality: 'usa'
        country: 'usa'
        image: ''
        gif: ''
      },
      {
        name: 'María de Antón'
        title: 'Sous Chef at The Bloge'
        handle: 'amalulla'
        nationality: 'spain'
        country: 'spain'
        image: ''
        gif: ''
      },
      {
        name: 'Danish Khan'
        title: 'Red Shirt'
        handle: 'danishkhan'
        nationality: 'usa'
        country: 'usa'
        image: ''
        gif: ''
      },
      {
        name: 'Dominic Jodoin'
        title: 'Humble Tab Hoarder'
        handle: 'cotsog'
        nationality: 'canada'
        country: 'canada'
        image: ''
        gif: ''
      },
      {
        name: 'Liza Brisker'
        title: 'Brainy Trainee'
        nationality: 'russia'
        country: 'germany'
        image: ''
        gif: ''
      }
    ]

`export default Route`
