import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

function maybeShuffleArray(array) {
  if (config.randomiseTeam) {
    return shuffleArray(array);
  } else {
    return array;
  }
}

// Adapted from https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default TravisRoute.extend({
  needsAuth: false,

  model() {
    return maybeShuffleArray([
      {
        name: 'Sven Fuchs',
        title: 'The Original Builder',
        handle: 'svenfuchs',
        nationality: 'germany',
        country: 'germany',
        image: 'sven'
      }, {
        name: 'Fritz Thielemann',
        title: 'Admin Adventures',
        handle: 'fritzek',
        nationality: 'germany',
        country: 'germany',
        image: 'fritz'
      }, {
        name: 'Konstantin Haase',
        title: 'Haase of Engineering',
        handle: 'konstantinhaase',
        nationality: 'germany',
        country: 'switzerland',
        image: 'konstantin'
      }, {
        name: 'Mathias Meyer',
        title: 'Director of Bacon Relations',
        handle: 'roidrage',
        nationality: 'germany',
        country: 'germany',
        image: 'mathias'
      }, {
        name: 'Piotr Sarnacki',
        title: 'Code Monkey',
        handle: 'drogus',
        nationality: 'poland',
        country: 'germany',
        image: 'piotr'
      }, {
        name: 'Anika Lindtner',
        title: 'Head Catwoman',
        handle: 'langziehohr',
        nationality: 'germany',
        country: 'germany',
        image: 'anika'
      }, {
        name: 'Justine Arreche',
        title: 'Lead Clipart Strategist',
        handle: 'ctrlaltjustine',
        nationality: 'usa',
        country: 'usa',
        image: 'justine'
      }, {
        name: 'Hiro Asari',
        title: 'Time Zone Nerd',
        handle: 'hiro_asari',
        nationality: 'japan',
        country: 'usa',
        image: 'hiro'
      }, {
        name: 'Dan Buch',
        title: 'That\'s Numberwang',
        handle: 'meatballhat',
        nationality: 'usa',
        country: 'usa',
        image: 'dan'
      }, {
        name: 'Lisa Passing',
        title: 'Queen of !important',
        nationality: 'germany',
        country: 'germany',
        image: 'lisa'
      }, {
        name: 'Carla Drago',
        title: 'inchworm',
        handle: 'carlad',
        nationality: 'italy',
        country: 'germany',
        image: 'carla'
      }, {
        name: 'Anja Reichmann',
        title: 'Tyranjasaurus Specs',
        handle: '_tyranja_',
        nationality: 'germany',
        country: 'germany',
        image: 'anja'
      }, {
        name: 'Amanda Quaranto',
        title: 'Crafting Extremist',
        handle: 'aquaranto',
        nationality: 'usa',
        country: 'usa',
        image: 'amanda'
      }, {
        name: 'Jen Duke',
        title: 'Gastrognome',
        handle: 'dukeofberlin',
        nationality: 'usa',
        country: 'germany',
        image: 'jen'
      }, {
        name: 'Emma Trimble',
        title: 'Lead Pungineer',
        handle: 'emdantrim',
        nationality: 'usa',
        country: 'usa',
        image: 'emma'
      }, {
        name: 'María de Antón',
        title: 'Sous Chef at The Bloge',
        handle: 'amalulla',
        nationality: 'spain',
        country: 'spain',
        image: 'maria'
      }, {
        name: 'Danish Khan',
        title: 'Red Shirt',
        handle: 'danishkhan',
        nationality: 'usa',
        country: 'usa',
        image: 'danish'
      }, {
        name: 'Dominic Jodoin',
        title: 'Humble Tab Hoarder',
        handle: 'cotsog',
        nationality: 'canada',
        country: 'canada',
        image: 'dominic'
      }, {
        name: 'Liz Brisker',
        title: 'Mermaid On Board',
        nationality: 'russia',
        country: 'germany',
        image: 'liz'
      }, {
        name: 'Laura Gaetano',
        title: 'Two Trick Pony',
        handle: 'alicetragedy',
        nationality: 'italy',
        country: 'austria',
        image: 'laura'
      }, {
        name: 'Maren Brechler',
        title: 'Number Juggler',
        nationality: 'germany',
        country: 'germany',
        image: 'maren'
      }, {
        name: 'Ana Rosas',
        title: 'Software Baker',
        handle: 'ana_rosas',
        nationality: 'mexico',
        country: 'mexico',
        image: 'ana'
      }, {
        name: 'Igor Wiedler',
        title: 'webmaster',
        handle: 'igorwhilefalse',
        nationality: 'ukswitzerland',
        country: 'germany',
        image: 'igor'
      }, {
        name: 'Carmen Andoh',
        title: 'SRE- Snazzy Rsync Empress',
        handle: 'caelestisca',
        nationality: 'usa',
        country: 'usa',
        image: 'carmen'
      }, {
        name: 'Buck Doyle',
        title: 'Jorts enthusiast',
        handle: 'buckdoyle',
        nationality: 'none',
        country: 'none',
        image: 'buck'
      }, {
        name: 'Curtis Ekstrom',
        title: 'Fallen for JavaScript',
        handle: 'clekstro',
        nationality: 'usa',
        country: 'germany',
        image: 'curtis'
      }, {
        name: 'Joe Corcoran',
        title: 'Bulldozer',
        handle: 'josephcorcoran',
        nationality: 'uk',
        country: 'germany',
        image: 'joe'
      }, {
        name: 'Aakriti Gupta',
        title: 'Custodian of the Hard Hat',
        handle: 'aakri_tea',
        nationality: 'india',
        country: 'germany',
        image: 'aakriti'
      }, {
        name: 'Renée Hendricksen',
        title: 'Ski Lift Operator',
        handle: 'gigglegirl4e',
        nationality: 'usa',
        country: 'usa',
        image: 'renee'
      }, {
        name: 'Brandon Ferguson',
        title: 'Actual Human Muppet',
        handle: 'bnferguson',
        nationality: 'usa',
        country: 'netherlands',
        image: 'bmoney'
      }, {
        name: 'Anna Nagy',
        title: 'Trainspotter',
        handle: 'acnagy',
        nationality: 'usa',
        country: 'usa',
        image: 'anna'
      }, {
        name: 'Lena Reinhard',
        title: 'Somehow I manage',
        handle: 'lrnrd',
        nationality: 'germany',
        country: 'germany',
        image: 'lena'
      }, {
        name: 'Joep van Delft',
        title: 'Lead Second-Guess Engineer',
        nationality: 'europe',
        country: 'europe',
        image: 'joep'
      }, {
        name: 'Sam Wright',
        title: 'Documentarian',
        handle: 'plaindocs',
        nationality: 'uk',
        country: 'germany',
        image: 'sam'
      }, {
        name: 'Lili Kui',
        title: 'Hammer Jammer',
        nationality: 'kenya',
        country: 'germany',
        image: 'lili'
      },
      {
        name: 'Carla Iriberri',
        title: 'Cacaolat Connoisseur',
        handle: 'iriberri1',
        nationality: 'spain',
        country: 'spain',
        image: 'iriberri'
      }, {
        name: 'Jan Schulte',
        title: 'Consulting Detective',
        handle: 'ganzefolge',
        nationality: 'germany',
        country: 'germany',
        image: 'jan'
      }, {
        name: 'Natalia Saavedra',
        title: 'Design Wizard',
        nationality: 'colombia',
        country: 'occupiedcanada',
        countryAlias: 'canada',
        image: 'natalia'
      },
      {
        name: 'Olamide Ojo',
        title: 'Mr Bean Counter',
        nationality: 'nigeria',
        country: 'germany',
        image: 'ola'
      },
      {
        name: 'Rajesh Guleria',
        title: 'The People\'s Man',
        nationality: 'india',
        country: 'germany',
        image: 'rajesh'
      },
      {
        name: 'Ryn Daniels',
        title: 'Ops Witch',
        handle: 'beerops',
        nationality: 'usa',
        country: 'usa',
        image: 'ryn'
      },
      {
        name: 'Bogdana Vereha',
        title: 'Mad Scientist',
        handle: 'bogdanavereha',
        nationality: 'romania',
        country: 'netherlands',
        image: 'bogdana'
      },
      {
        name: 'AJ Bowen',
        title: 'Cyber Squirrel',
        handle: 's0ulshake',
        nationality: 'usa',
        country: 'germany',
        image: 'aj'
      },
      {
        name: 'Mariana Guzman Ruiz',
        title: 'Impromptu City Cyclist',
        handle: 'GuzmanMariana13',
        nationality: 'mexico',
        country: 'usa',
        image: 'mariana'
      },
      {
        name: 'Joshua Wehner',
        title: 'Barrier Removal',
        handle: 'jaw6',
        nationality: 'usa',
        country: 'usa',
        image: 'joshua'
      },
      {
        name: 'Nick Stenning',
        title: 'Nopealope Herder',
        handle: 'nickstenning',
        nationality: 'europe',
        country: 'germany',
        image: 'nick'
      },
      {
        name: 'Bianca Wilk',
        title: 'Marketing Builder',
        handle: 'biancatwilk',
        nationality: 'polandchile',
        country: 'germanycolombia',
        image: 'bianca'
      },
      {
        name: 'Kris Svardstal',
        title: 'Customer Avocado',
        handle: 'DrTorte',
        nationality: 'sweden',
        country: 'canada',
        image: 'kris'
      }
    ]);
  }
});
