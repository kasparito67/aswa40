'use strict';

// Ranking and editorial content. Keep presentation logic in app.js.
const films = [
  {
    "rank": 1,
    "title": "Lord of the Rings",
    "subtitle": "franchise",
    "pts": 164,
    "votes": "8/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/001-lord-of-the-rings.jpg"
  },
  {
    "rank": 2,
    "title": "Inglourious Basterds",
    "subtitle": "",
    "pts": 111,
    "votes": "7/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/002-inglourious-basterds.jpg"
  },
  {
    "rank": 3,
    "title": "Spirited Away",
    "subtitle": "",
    "pts": 79,
    "votes": "4/9",
    "best": "#2",
    "img": "assets/posters/2000-2024/003-spirited-away.jpg"
  },
  {
    "rank": 4,
    "title": "The Social Network",
    "subtitle": "",
    "pts": 71,
    "votes": "4/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/004-the-social-network.jpg"
  },
  {
    "rank": 5,
    "title": "Christopher Nolan’s Batman",
    "subtitle": "franchise",
    "pts": 62,
    "votes": "4/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/005-christopher-nolan-s-batman.jpg"
  },
  {
    "rank": 6,
    "title": "The Departed",
    "subtitle": "",
    "pts": 61,
    "votes": "4/9",
    "best": "#7",
    "img": "assets/posters/2000-2024/006-the-departed.jpg"
  },
  {
    "rank": 7,
    "title": "Lost in Translation",
    "subtitle": "",
    "pts": 59,
    "votes": "5/9",
    "best": "#5",
    "img": "assets/posters/2000-2024/007-lost-in-translation.jpg"
  },
  {
    "rank": 8,
    "title": "Amélie",
    "subtitle": "",
    "pts": 57,
    "votes": "5/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/008-amelie.jpg"
  },
  {
    "rank": 9,
    "title": "Gladiator",
    "subtitle": "",
    "pts": 54,
    "votes": "3/9",
    "best": "#2",
    "img": "assets/posters/2000-2024/009-gladiator.jpg"
  },
  {
    "rank": 10,
    "title": "Kill Bill",
    "subtitle": "franchise",
    "pts": 51,
    "votes": "4/9",
    "best": "#9",
    "img": "assets/posters/2000-2024/010-kill-bill.jpg"
  },
  {
    "rank": 11,
    "title": "Crouching Tiger, Hidden Dragon",
    "subtitle": "",
    "pts": 51,
    "votes": "3/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/011-crouching-tiger-hidden-dragon.jpg"
  },
  {
    "rank": 12,
    "title": "Requiem for a Dream",
    "subtitle": "",
    "pts": 48,
    "votes": "2/9",
    "best": "#2",
    "img": "assets/posters/2000-2024/012-requiem-for-a-dream.jpg"
  },
  {
    "rank": 13,
    "title": "Catch Me If You Can",
    "subtitle": "",
    "pts": 47,
    "votes": "3/9",
    "best": "#8",
    "img": "assets/posters/2000-2024/013-catch-me-if-you-can.jpg"
  },
  {
    "rank": 14,
    "title": "Sideways",
    "subtitle": "",
    "pts": 44,
    "votes": "3/9",
    "best": "#6",
    "img": "assets/posters/2000-2024/014-sideways.jpg"
  },
  {
    "rank": 15,
    "title": "City of God",
    "subtitle": "",
    "pts": 43,
    "votes": "3/9",
    "best": "#5",
    "img": "assets/posters/2000-2024/015-city-of-god.jpg"
  },
  {
    "rank": 16,
    "title": "Snatch",
    "subtitle": "",
    "pts": 42,
    "votes": "2/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/016-snatch.jpg"
  },
  {
    "rank": 17,
    "title": "Shaun of the Dead",
    "subtitle": "",
    "pts": 39,
    "votes": "2/9",
    "best": "#2",
    "img": "assets/posters/2000-2024/017-shaun-of-the-dead.jpg"
  },
  {
    "rank": 18,
    "title": "Black Hawk Down",
    "subtitle": "",
    "pts": 39,
    "votes": "2/9",
    "best": "#5",
    "img": "assets/posters/2000-2024/018-black-hawk-down.jpg"
  },
  {
    "rank": 19,
    "title": "Dune",
    "subtitle": "franchise",
    "pts": 38,
    "votes": "5/9",
    "best": "#10",
    "img": "assets/posters/2000-2024/019-dune.jpg"
  },
  {
    "rank": 20,
    "title": "A Prophet",
    "subtitle": "",
    "pts": 38,
    "votes": "3/9",
    "best": "#10",
    "img": "assets/posters/2000-2024/020-a-prophet.jpg"
  },
  {
    "rank": 21,
    "title": "The Wolf of Wall Street",
    "subtitle": "",
    "pts": 38,
    "votes": "3/9",
    "best": "#10",
    "img": "assets/posters/2000-2024/021-the-wolf-of-wall-street.jpg"
  },
  {
    "rank": 22,
    "title": "Slumdog Millionaire",
    "subtitle": "",
    "pts": 37,
    "votes": "2/9",
    "best": "#4",
    "img": "assets/posters/2000-2024/022-slumdog-millionaire.jpg"
  },
  {
    "rank": 23,
    "title": "Children of Men",
    "subtitle": "",
    "pts": 35,
    "votes": "2/9",
    "best": "#4",
    "img": "assets/posters/2000-2024/023-children-of-men.jpg"
  },
  {
    "rank": 24,
    "title": "Inception",
    "subtitle": "",
    "pts": 33,
    "votes": "2/9",
    "best": "#6",
    "img": "assets/posters/2000-2024/024-inception.jpg"
  },
  {
    "rank": 25,
    "title": "The King’s Speech",
    "subtitle": "",
    "pts": 32,
    "votes": "2/9",
    "best": "#6",
    "img": "assets/posters/2000-2024/025-the-king-s-speech.jpg"
  },
  {
    "rank": 26,
    "title": "Whiplash",
    "subtitle": "",
    "pts": 31,
    "votes": "3/9",
    "best": "#9",
    "img": "assets/posters/2000-2024/026-whiplash.jpg"
  },
  {
    "rank": 27,
    "title": "Ex Machina",
    "subtitle": "",
    "pts": 31,
    "votes": "2/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/027-ex-machina.jpg"
  },
  {
    "rank": 28,
    "title": "Parasite",
    "subtitle": "",
    "pts": 29,
    "votes": "4/9",
    "best": "#9",
    "img": "assets/posters/2000-2024/028-parasite.jpg"
  },
  {
    "rank": 29,
    "title": "Mad Max: Fury Road",
    "subtitle": "",
    "pts": 29,
    "votes": "2/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/029-mad-max-fury-road.jpg"
  },
  {
    "rank": 30,
    "title": "The Grand Budapest Hotel",
    "subtitle": "",
    "pts": 29,
    "votes": "2/9",
    "best": "#6",
    "img": "assets/posters/2000-2024/030-the-grand-budapest-hotel.jpg"
  },
  {
    "rank": 31,
    "title": "No Country for Old Men",
    "subtitle": "",
    "pts": 27,
    "votes": "3/9",
    "best": "#9",
    "img": "assets/posters/2000-2024/031-no-country-for-old-men.jpg"
  },
  {
    "rank": 32,
    "title": "Harry Potter (franchise)",
    "subtitle": "franchise",
    "pts": 27,
    "votes": "2/9",
    "best": "#11",
    "img": "assets/posters/2000-2024/032-harry-potter-franchise.jpg"
  },
  {
    "rank": 33,
    "title": "Pan's Labyrinth",
    "subtitle": "",
    "pts": 27,
    "votes": "2/9",
    "best": "#12",
    "img": "assets/posters/2000-2024/033-pan-s-labyrinth.jpg"
  },
  {
    "rank": 34,
    "title": "American Psycho",
    "subtitle": "",
    "pts": 26,
    "votes": "2/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/034-american-psycho.jpg"
  },
  {
    "rank": 35,
    "title": "Superbad",
    "subtitle": "",
    "pts": 26,
    "votes": "2/9",
    "best": "#13",
    "img": "assets/posters/2000-2024/035-superbad.jpg"
  },
  {
    "rank": 36,
    "title": "Dunkirk",
    "subtitle": "",
    "pts": 25,
    "votes": "4/9",
    "best": "#17",
    "img": "assets/posters/2000-2024/036-dunkirk.jpg"
  },
  {
    "rank": 37,
    "title": "Ratatouille",
    "subtitle": "",
    "pts": 25,
    "votes": "2/9",
    "best": "#12",
    "img": "assets/posters/2000-2024/037-ratatouille.jpg"
  },
  {
    "rank": 38,
    "title": "Moonlight",
    "subtitle": "",
    "pts": 25,
    "votes": "2/9",
    "best": "#13",
    "img": "assets/posters/2000-2024/038-moonlight.jpg"
  },
  {
    "rank": 39,
    "title": "Anora",
    "subtitle": "",
    "pts": 25,
    "votes": "1/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/039-anora.jpg"
  },
  {
    "rank": 40,
    "title": "High Fidelity",
    "subtitle": "",
    "pts": 25,
    "votes": "1/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/040-high-fidelity.jpg"
  },
  {
    "rank": 41,
    "title": "Maelström",
    "subtitle": "",
    "pts": 25,
    "votes": "1/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/041-maelstrom.jpg"
  },
  {
    "rank": 42,
    "title": "The Taste of Others",
    "subtitle": "",
    "pts": 25,
    "votes": "1/9",
    "best": "#1",
    "img": "assets/posters/2000-2024/042-the-taste-of-others.jpg"
  },
  {
    "rank": 43,
    "title": "Almost Famous",
    "subtitle": "",
    "pts": 24,
    "votes": "1/9",
    "best": "#2",
    "img": "assets/posters/2000-2024/043-almost-famous.jpg"
  },
  {
    "rank": 44,
    "title": "Everything Everywhere All at Once",
    "subtitle": "",
    "pts": 24,
    "votes": "1/9",
    "best": "#2",
    "img": "assets/posters/2000-2024/044-everything-everywhere-all-at-once.jpg"
  },
  {
    "rank": 45,
    "title": "Into the Wild",
    "subtitle": "",
    "pts": 24,
    "votes": "1/9",
    "best": "#2",
    "img": "assets/posters/2000-2024/045-into-the-wild.jpg"
  },
  {
    "rank": 46,
    "title": "There Will Be Blood",
    "subtitle": "",
    "pts": 24,
    "votes": "1/9",
    "best": "#2",
    "img": "assets/posters/2000-2024/046-there-will-be-blood.jpg"
  },
  {
    "rank": 47,
    "title": "Bobby Jones: Stroke of Genius",
    "subtitle": "",
    "pts": 23,
    "votes": "1/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/047-bobby-jones-stroke-of-genius.jpg"
  },
  {
    "rank": 48,
    "title": "Hot Fuzz",
    "subtitle": "",
    "pts": 23,
    "votes": "1/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/048-hot-fuzz.jpg"
  },
  {
    "rank": 49,
    "title": "Reality",
    "subtitle": "",
    "pts": 23,
    "votes": "1/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/049-reality.jpg"
  },
  {
    "rank": 50,
    "title": "Traffic",
    "subtitle": "",
    "pts": 23,
    "votes": "1/9",
    "best": "#3",
    "img": "assets/posters/2000-2024/050-traffic.jpg"
  },
  {
    "rank": 51,
    "title": "Incendies",
    "subtitle": "",
    "pts": 22,
    "votes": "2/9",
    "best": "#13",
    "img": "assets/posters/2000-2024/051-incendies.jpg"
  },
  {
    "rank": 52,
    "title": "Once Upon a Time… in Hollywood",
    "subtitle": "",
    "pts": 22,
    "votes": "2/9",
    "best": "#14",
    "img": "assets/posters/2000-2024/052-once-upon-a-time-in-hollywood.jpg"
  },
  {
    "rank": 53,
    "title": "Donnie Darko",
    "subtitle": "",
    "pts": 22,
    "votes": "1/9",
    "best": "#4",
    "img": "assets/posters/2000-2024/053-donnie-darko.jpg"
  },
  {
    "rank": 54,
    "title": "My Wife Is an Actress",
    "subtitle": "",
    "pts": 22,
    "votes": "1/9",
    "best": "#4",
    "img": "assets/posters/2000-2024/054-my-wife-is-an-actress.jpg"
  },
  {
    "rank": 55,
    "title": "Read My Lips",
    "subtitle": "",
    "pts": 22,
    "votes": "1/9",
    "best": "#4",
    "img": "assets/posters/2000-2024/055-read-my-lips.jpg"
  },
  {
    "rank": 56,
    "title": "Drive",
    "subtitle": "",
    "pts": 21,
    "votes": "2/9",
    "best": "#15",
    "img": "assets/posters/2000-2024/056-drive.jpg"
  },
  {
    "rank": 57,
    "title": "28 Days Later",
    "subtitle": "",
    "pts": 21,
    "votes": "1/9",
    "best": "#5",
    "img": "assets/posters/2000-2024/057-28-days-later.jpg"
  },
  {
    "rank": 58,
    "title": "L’Auberge espagnole",
    "subtitle": "",
    "pts": 21,
    "votes": "1/9",
    "best": "#5",
    "img": "assets/posters/2000-2024/058-l-auberge-espagnole.jpg"
  },
  {
    "rank": 59,
    "title": "The Darjeeling Limited",
    "subtitle": "",
    "pts": 21,
    "votes": "1/9",
    "best": "#5",
    "img": "assets/posters/2000-2024/059-the-darjeeling-limited.jpg"
  },
  {
    "rank": 60,
    "title": "Up",
    "subtitle": "",
    "pts": 21,
    "votes": "1/9",
    "best": "#5",
    "img": "assets/posters/2000-2024/060-up.jpg"
  },
  {
    "rank": 61,
    "title": "Astérix & Obélix : Mission Cléopâtre",
    "subtitle": "",
    "pts": 20,
    "votes": "1/9",
    "best": "#6",
    "img": "assets/posters/2000-2024/061-asterix-obelix-mission-cleopatre.jpg"
  },
  {
    "rank": 62,
    "title": "Mondays in the Sun",
    "subtitle": "",
    "pts": 20,
    "votes": "1/9",
    "best": "#6",
    "img": "assets/posters/2000-2024/062-mondays-in-the-sun.jpg"
  },
  {
    "rank": 63,
    "title": "The Assassination of Jesse James by the Coward Robert Ford",
    "subtitle": "",
    "pts": 19,
    "votes": "1/9",
    "best": "#7",
    "img": "assets/posters/2000-2024/063-the-assassination-of-jesse-james-by-the-coward-robert-ford.jpg"
  },
  {
    "rank": 64,
    "title": "The Last King of Scotland",
    "subtitle": "",
    "pts": 19,
    "votes": "1/9",
    "best": "#7",
    "img": "assets/posters/2000-2024/064-the-last-king-of-scotland.jpg"
  },
  {
    "rank": 65,
    "title": "The Pianist",
    "subtitle": "",
    "pts": 19,
    "votes": "1/9",
    "best": "#7",
    "img": "assets/posters/2000-2024/065-the-pianist.jpg"
  },
  {
    "rank": 66,
    "title": "The Squid and the Whale",
    "subtitle": "",
    "pts": 19,
    "votes": "1/9",
    "best": "#7",
    "img": "assets/posters/2000-2024/066-the-squid-and-the-whale.jpg"
  },
  {
    "rank": 67,
    "title": "This Is the End",
    "subtitle": "",
    "pts": 19,
    "votes": "1/9",
    "best": "#7",
    "img": "assets/posters/2000-2024/067-this-is-the-end.jpg"
  },
  {
    "rank": 68,
    "title": "Happily Ever After",
    "subtitle": "",
    "pts": 18,
    "votes": "1/9",
    "best": "#8",
    "img": "assets/posters/2000-2024/068-happily-ever-after.jpg"
  },
  {
    "rank": 69,
    "title": "Memories of Murder",
    "subtitle": "",
    "pts": 18,
    "votes": "1/9",
    "best": "#8",
    "img": "assets/posters/2000-2024/069-memories-of-murder.jpg"
  },
  {
    "rank": 70,
    "title": "Michael Clayton",
    "subtitle": "",
    "pts": 18,
    "votes": "1/9",
    "best": "#8",
    "img": "assets/posters/2000-2024/070-michael-clayton.jpg"
  },
  {
    "rank": 71,
    "title": "The Royal Tenenbaums",
    "subtitle": "",
    "pts": 18,
    "votes": "1/9",
    "best": "#8",
    "img": "assets/posters/2000-2024/071-the-royal-tenenbaums.jpg"
  },
  {
    "rank": 72,
    "title": "V for Vendetta",
    "subtitle": "",
    "pts": 17,
    "votes": "1/9",
    "best": "#9",
    "img": "assets/posters/2000-2024/072-v-for-vendetta.jpg"
  },
  {
    "rank": 73,
    "title": "Zodiac",
    "subtitle": "",
    "pts": 17,
    "votes": "1/9",
    "best": "#9",
    "img": "assets/posters/2000-2024/073-zodiac.jpg"
  },
  {
    "rank": 74,
    "title": "Get Out",
    "subtitle": "",
    "pts": 16,
    "votes": "2/9",
    "best": "#14",
    "img": "assets/posters/2000-2024/074-get-out.jpg"
  },
  {
    "rank": 75,
    "title": "OSS 117 (franchise)",
    "subtitle": "franchise",
    "pts": 16,
    "votes": "1/9",
    "best": "#10",
    "img": "assets/posters/2000-2024/075-oss-117-franchise.jpg"
  },
  {
    "rank": 76,
    "title": "Ponyo",
    "subtitle": "",
    "pts": 16,
    "votes": "1/9",
    "best": "#10",
    "img": "assets/posters/2000-2024/076-ponyo.jpg"
  },
  {
    "rank": 77,
    "title": "Django Unchained",
    "subtitle": "",
    "pts": 15,
    "votes": "2/9",
    "best": "#16",
    "img": "assets/posters/2000-2024/077-django-unchained.jpg"
  },
  {
    "rank": 78,
    "title": "Brokeback Mountain",
    "subtitle": "",
    "pts": 15,
    "votes": "1/9",
    "best": "#11",
    "img": "assets/posters/2000-2024/078-brokeback-mountain.jpg"
  },
  {
    "rank": 79,
    "title": "Dallas Buyers Club",
    "subtitle": "",
    "pts": 14,
    "votes": "2/9",
    "best": "#18",
    "img": "assets/posters/2000-2024/079-dallas-buyers-club.jpg"
  },
  {
    "rank": 80,
    "title": "Blade Runner 2049",
    "subtitle": "",
    "pts": 14,
    "votes": "1/9",
    "best": "#12",
    "img": "assets/posters/2000-2024/080-blade-runner-2049.jpg"
  },
  {
    "rank": 81,
    "title": "Downfall",
    "subtitle": "",
    "pts": 14,
    "votes": "1/9",
    "best": "#12",
    "img": "assets/posters/2000-2024/081-downfall.jpg"
  },
  {
    "rank": 82,
    "title": "Fantastic Mr. Fox",
    "subtitle": "",
    "pts": 14,
    "votes": "1/9",
    "best": "#12",
    "img": "assets/posters/2000-2024/082-fantastic-mr-fox.jpg"
  },
  {
    "rank": 83,
    "title": "Toy Story 3",
    "subtitle": "",
    "pts": 14,
    "votes": "1/9",
    "best": "#12",
    "img": "assets/posters/2000-2024/083-toy-story-3.jpg"
  },
  {
    "rank": 84,
    "title": "Casino Royale",
    "subtitle": "",
    "pts": 13,
    "votes": "2/9",
    "best": "#16",
    "img": "assets/posters/2000-2024/084-casino-royale.jpg"
  },
  {
    "rank": 85,
    "title": "12 Years a Slave",
    "subtitle": "",
    "pts": 11,
    "votes": "1/9",
    "best": "#15",
    "img": "assets/posters/2000-2024/085-12-years-a-slave.jpg"
  },
  {
    "rank": 86,
    "title": "Moneyball",
    "subtitle": "",
    "pts": 11,
    "votes": "1/9",
    "best": "#15",
    "img": "assets/posters/2000-2024/086-moneyball.jpg"
  },
  {
    "rank": 87,
    "title": "The Intouchables",
    "subtitle": "",
    "pts": 11,
    "votes": "1/9",
    "best": "#15",
    "img": "assets/posters/2000-2024/087-the-intouchables.jpg"
  },
  {
    "rank": 88,
    "title": "Silver Linings Playbook",
    "subtitle": "",
    "pts": 10,
    "votes": "1/9",
    "best": "#16",
    "img": "assets/posters/2000-2024/088-silver-linings-playbook.jpg"
  },
  {
    "rank": 89,
    "title": "Ocean's Eleven",
    "subtitle": "",
    "pts": 9,
    "votes": "2/9",
    "best": "#19",
    "img": "assets/posters/2000-2024/089-ocean-s-eleven.jpg"
  },
  {
    "rank": 90,
    "title": "Blue Jasmine",
    "subtitle": "",
    "pts": 9,
    "votes": "1/9",
    "best": "#17",
    "img": "assets/posters/2000-2024/090-blue-jasmine.jpg"
  },
  {
    "rank": 91,
    "title": "Ghost in the Shell",
    "subtitle": "",
    "pts": 9,
    "votes": "1/9",
    "best": "#17",
    "img": "assets/posters/2000-2024/091-ghost-in-the-shell.jpg"
  },
  {
    "rank": 92,
    "title": "The Hunt",
    "subtitle": "",
    "pts": 9,
    "votes": "1/9",
    "best": "#17",
    "img": "assets/posters/2000-2024/092-the-hunt.jpg"
  },
  {
    "rank": 93,
    "title": "Avengers (franchise)",
    "subtitle": "franchise",
    "pts": 8,
    "votes": "1/9",
    "best": "#18",
    "img": "assets/posters/2000-2024/093-avengers-franchise.jpg"
  },
  {
    "rank": 94,
    "title": "Boyhood",
    "subtitle": "",
    "pts": 8,
    "votes": "1/9",
    "best": "#18",
    "img": "assets/posters/2000-2024/094-boyhood.jpg"
  },
  {
    "rank": 95,
    "title": "Inherent Vice",
    "subtitle": "",
    "pts": 8,
    "votes": "1/9",
    "best": "#18",
    "img": "assets/posters/2000-2024/095-inherent-vice.jpg"
  },
  {
    "rank": 96,
    "title": "Midnight in Paris",
    "subtitle": "",
    "pts": 8,
    "votes": "1/9",
    "best": "#18",
    "img": "assets/posters/2000-2024/096-midnight-in-paris.jpg"
  },
  {
    "rank": 97,
    "title": "What We Do in the Shadows",
    "subtitle": "",
    "pts": 8,
    "votes": "1/9",
    "best": "#18",
    "img": "assets/posters/2000-2024/097-what-we-do-in-the-shadows.jpg"
  },
  {
    "rank": 98,
    "title": "Hell or High Water",
    "subtitle": "",
    "pts": 7,
    "votes": "1/9",
    "best": "#19",
    "img": "assets/posters/2000-2024/098-hell-or-high-water.jpg"
  },
  {
    "rank": 99,
    "title": "Her",
    "subtitle": "",
    "pts": 7,
    "votes": "1/9",
    "best": "#19",
    "img": "assets/posters/2000-2024/099-her.jpg"
  },
  {
    "rank": 100,
    "title": "Interstellar",
    "subtitle": "",
    "pts": 7,
    "votes": "1/9",
    "best": "#19",
    "img": "assets/posters/2000-2024/100-interstellar.jpg"
  },
  {
    "rank": 101,
    "title": "The 40-Year-Old Virgin",
    "subtitle": "",
    "pts": 7,
    "votes": "1/9",
    "best": "#19",
    "img": "assets/posters/2000-2024/101-the-40-year-old-virgin.jpg"
  },
  {
    "rank": 102,
    "title": "The Big Short",
    "subtitle": "",
    "pts": 7,
    "votes": "1/9",
    "best": "#19",
    "img": "assets/posters/2000-2024/102-the-big-short.jpg"
  },
  {
    "rank": 103,
    "title": "Wild Tales",
    "subtitle": "",
    "pts": 7,
    "votes": "1/9",
    "best": "#19",
    "img": "assets/posters/2000-2024/103-wild-tales.jpg"
  },
  {
    "rank": 104,
    "title": "Arrival",
    "subtitle": "",
    "pts": 6,
    "votes": "1/9",
    "best": "#20",
    "img": "assets/posters/2000-2024/104-arrival.jpg"
  },
  {
    "rank": 105,
    "title": "Inside Out",
    "subtitle": "",
    "pts": 6,
    "votes": "1/9",
    "best": "#20",
    "img": "assets/posters/2000-2024/105-inside-out.jpg"
  },
  {
    "rank": 106,
    "title": "Pirates of the Caribbean (franchise)",
    "subtitle": "franchise",
    "pts": 6,
    "votes": "1/9",
    "best": "#20",
    "img": "assets/posters/2000-2024/106-pirates-of-the-caribbean-franchise.jpg"
  },
  {
    "rank": 107,
    "title": "The Witch",
    "subtitle": "",
    "pts": 6,
    "votes": "1/9",
    "best": "#20",
    "img": "assets/posters/2000-2024/107-the-witch.jpg"
  },
  {
    "rank": 108,
    "title": "About Schmidt",
    "subtitle": "",
    "pts": 5,
    "votes": "1/9",
    "best": "#21",
    "img": "assets/posters/2000-2024/108-about-schmidt.jpg"
  },
  {
    "rank": 109,
    "title": "Phantom Thread",
    "subtitle": "",
    "pts": 5,
    "votes": "1/9",
    "best": "#21",
    "img": "assets/posters/2000-2024/109-phantom-thread.jpg"
  },
  {
    "rank": 110,
    "title": "Sink or Swim",
    "subtitle": "",
    "pts": 5,
    "votes": "1/9",
    "best": "#21",
    "img": "assets/posters/2000-2024/110-sink-or-swim.jpg"
  },
  {
    "rank": 111,
    "title": "The Boy and the Beast",
    "subtitle": "",
    "pts": 5,
    "votes": "1/9",
    "best": "#21",
    "img": "assets/posters/2000-2024/111-the-boy-and-the-beast.jpg"
  },
  {
    "rank": 112,
    "title": "The Butterfly",
    "subtitle": "",
    "pts": 5,
    "votes": "1/9",
    "best": "#21",
    "img": "assets/posters/2000-2024/112-the-butterfly.jpg"
  },
  {
    "rank": 113,
    "title": "The Last Duel",
    "subtitle": "",
    "pts": 5,
    "votes": "1/9",
    "best": "#21",
    "img": "assets/posters/2000-2024/113-the-last-duel.jpg"
  },
  {
    "rank": 114,
    "title": "The Revenant",
    "subtitle": "",
    "pts": 5,
    "votes": "1/9",
    "best": "#21",
    "img": "assets/posters/2000-2024/114-the-revenant.jpg"
  },
  {
    "rank": 115,
    "title": "A History of Violence",
    "subtitle": "",
    "pts": 4,
    "votes": "1/9",
    "best": "#22",
    "img": "assets/posters/2000-2024/115-a-history-of-violence.jpg"
  },
  {
    "rank": 116,
    "title": "Big Fish",
    "subtitle": "",
    "pts": 4,
    "votes": "1/9",
    "best": "#22",
    "img": "assets/posters/2000-2024/116-big-fish.jpg"
  },
  {
    "rank": 117,
    "title": "The Chorus",
    "subtitle": "",
    "pts": 4,
    "votes": "1/9",
    "best": "#22",
    "img": "assets/posters/2000-2024/117-the-chorus.jpg"
  },
  {
    "rank": 118,
    "title": "The Coffee Table",
    "subtitle": "",
    "pts": 4,
    "votes": "1/9",
    "best": "#22",
    "img": "assets/posters/2000-2024/118-the-coffee-table.jpg"
  },
  {
    "rank": 119,
    "title": "Uncut Gems",
    "subtitle": "",
    "pts": 4,
    "votes": "1/9",
    "best": "#22",
    "img": "assets/posters/2000-2024/119-uncut-gems.jpg"
  },
  {
    "rank": 120,
    "title": "X-Men (franchise)",
    "subtitle": "franchise",
    "pts": 4,
    "votes": "1/9",
    "best": "#22",
    "img": "assets/posters/2000-2024/120-x-men-franchise.jpg"
  },
  {
    "rank": 121,
    "title": "All Quiet on the Western Front",
    "subtitle": "",
    "pts": 3,
    "votes": "1/9",
    "best": "#23",
    "img": "assets/posters/2000-2024/121-all-quiet-on-the-western-front.jpg"
  },
  {
    "rank": 122,
    "title": "Another Round",
    "subtitle": "",
    "pts": 3,
    "votes": "1/9",
    "best": "#23",
    "img": "assets/posters/2000-2024/122-another-round.jpg"
  },
  {
    "rank": 123,
    "title": "Bourne (franchise)",
    "subtitle": "franchise",
    "pts": 3,
    "votes": "1/9",
    "best": "#23",
    "img": "assets/posters/2000-2024/123-bourne-franchise.jpg"
  },
  {
    "rank": 124,
    "title": "Finding Nemo",
    "subtitle": "",
    "pts": 3,
    "votes": "1/9",
    "best": "#23",
    "img": "assets/posters/2000-2024/124-finding-nemo.jpg"
  },
  {
    "rank": 125,
    "title": "The Help",
    "subtitle": "",
    "pts": 3,
    "votes": "1/9",
    "best": "#23",
    "img": "assets/posters/2000-2024/125-the-help.jpg"
  },
  {
    "rank": 126,
    "title": "The Worst Person in the World",
    "subtitle": "",
    "pts": 3,
    "votes": "1/9",
    "best": "#23",
    "img": "assets/posters/2000-2024/126-the-worst-person-in-the-world.jpg"
  },
  {
    "rank": 127,
    "title": "My Octopus Teacher",
    "subtitle": "",
    "pts": 2,
    "votes": "1/9",
    "best": "#24",
    "img": "assets/posters/2000-2024/127-my-octopus-teacher.jpg"
  },
  {
    "rank": 128,
    "title": "Spider-Verse (franchise)",
    "subtitle": "franchise",
    "pts": 2,
    "votes": "1/9",
    "best": "#24",
    "img": "assets/posters/2000-2024/128-spider-verse-franchise.jpg"
  },
  {
    "rank": 129,
    "title": "The Zone of Interest",
    "subtitle": "",
    "pts": 2,
    "votes": "1/9",
    "best": "#24",
    "img": "assets/posters/2000-2024/129-the-zone-of-interest.jpg"
  },
  {
    "rank": 130,
    "title": "Tommy's Honour",
    "subtitle": "",
    "pts": 2,
    "votes": "1/9",
    "best": "#24",
    "img": "assets/posters/2000-2024/130-tommy-s-honour.jpg"
  },
  {
    "rank": 131,
    "title": "Unbreakable",
    "subtitle": "",
    "pts": 2,
    "votes": "1/9",
    "best": "#24",
    "img": "assets/posters/2000-2024/131-unbreakable.jpg"
  },
  {
    "rank": 132,
    "title": "American Gangster",
    "subtitle": "",
    "pts": 1,
    "votes": "1/9",
    "best": "#25",
    "img": "assets/posters/2000-2024/132-american-gangster.jpg"
  },
  {
    "rank": 133,
    "title": "Memento",
    "subtitle": "",
    "pts": 1,
    "votes": "1/9",
    "best": "#25",
    "img": "assets/posters/2000-2024/133-memento.jpg"
  },
  {
    "rank": 134,
    "title": "Perfect Days",
    "subtitle": "",
    "pts": 1,
    "votes": "1/9",
    "best": "#25",
    "img": "assets/posters/2000-2024/134-perfect-days.jpg"
  },
  {
    "rank": 135,
    "title": "Triangle of Sadness",
    "subtitle": "",
    "pts": 1,
    "votes": "1/9",
    "best": "#25",
    "img": "assets/posters/2000-2024/135-triangle-of-sadness.jpg"
  }
];

const details = {
  "1": {
    "headline": "La religion commune",
    "body": "164 points, 8 votes sur 9. Le seul membre sans Lord of the Rings est JB. Les huit autres le placent en moyenne autour du rang 5,5. Le regroupement par franchise révèle un consensus exceptionnel.",
    "rows": [
      [
        "Alex",
        "Return of the King",
        "#4"
      ],
      [
        "Claude",
        "Fellowship of the Ring",
        "#4"
      ],
      [
        "Garci",
        "The Two Towers",
        "#7"
      ],
      [
        "Max",
        "The Two Towers",
        "#12"
      ],
      [
        "Monette",
        "The Two Towers",
        "#6"
      ],
      [
        "Nic",
        "Return of the King",
        "#1"
      ],
      [
        "Quentin",
        "Fellowship of the Ring",
        "#4"
      ],
      [
        "Simon",
        "Fellowship of the Ring",
        "#6"
      ]
    ]
  },
  "2": {
    "headline": "Le champion des films uniques",
    "body": "111 points, 7/9. Aucun film individuel ne s’approche de ce niveau de consensus. Le PDF le décrit aussi comme très représentatif du groupe : film de genre, grand spectacle, humour noir, violence, cinéphilie et histoire réinventée.",
    "rows": [
      [
        "Alex",
        "Inglourious Basterds",
        "#1"
      ],
      [
        "Max",
        "Inglourious Basterds",
        "#5"
      ],
      [
        "Claude",
        "Inglourious Basterds",
        "#11"
      ],
      [
        "Monette",
        "Inglourious Basterds",
        "#11"
      ],
      [
        "Quentin",
        "Inglourious Basterds",
        "#11"
      ],
      [
        "Nic",
        "Inglourious Basterds",
        "#16"
      ],
      [
        "Simon",
        "Inglourious Basterds",
        "#16"
      ]
    ],
    "foot": "Garci et JB ne le choisissent pas."
  },
  "3": {
    "headline": "Intensité > largeur",
    "body": "Spirited Away n’a que 4 votes, mais ils sont très hauts : #2, #7, #8 et #8. Il finit donc #3. Le PDF s’en sert pour montrer que le système pondéré distingue un film adoré d’un film simplement largement respecté."
  },
  "8": {
    "headline": "Le cas le plus éclaté",
    "body": "Amélie obtient 5 votes, mais avec des relations très différentes au film : JB #3, Simon #5, Claude #15, Alex #25 et Max #25."
  },
  "10": {
    "headline": "Tarantino est le patron",
    "body": "Le PDF souligne que Inglourious Basterds, Kill Bill, Once Upon a Time… in Hollywood et Django Unchained totalisent une masse impressionnante de présences."
  },
  "19": {
    "headline": "Consensus vs intensité",
    "body": "Dune a 5 votes, mais plutôt bas : #10, #16, #16, #25 et #25. Il finit #19. Le contraste avec Spirited Away illustre la différence entre un film largement respecté et un film placé très haut par ses fans."
  },
  "24": {
    "headline": "Nolan très fort dans le groupe",
    "body": "Le PDF note que Nolan, comme Villeneuve, est très fort dans le palmarès. Inception figure au #24 avec 33 points et 2 votes."
  },
  "28": {
    "headline": "Respecté plus qu’adoré",
    "body": "Parasite est cité comme un cas révélateur : quatre mentions, mais plutôt basses. Le groupe le respecte beaucoup plus qu’il ne le place au sommet de son cœur."
  },
  "36": {
    "headline": "Nolan très fort dans le groupe",
    "body": "Dunkirk obtient 25 points avec 4 votes. Le PDF souligne plus largement la forte présence de Nolan dans les listes."
  },
  "51": {
    "headline": "Villeneuve très fort dans le groupe",
    "body": "Incendies obtient 22 points avec 2 votes. Le PDF note plus largement que Villeneuve fait partie des cinéastes très forts dans ce palmarès."
  },
  "52": {
    "headline": "Tarantino est le patron",
    "body": "Le PDF regroupe Once Upon a Time… in Hollywood avec Inglourious Basterds, Kill Bill et Django Unchained pour illustrer la très forte présence de Tarantino."
  },
  "77": {
    "headline": "Tarantino est le patron",
    "body": "Le PDF regroupe Django Unchained avec Inglourious Basterds, Kill Bill et Once Upon a Time… in Hollywood pour illustrer la très forte présence de Tarantino."
  }
};

const ghosts = [
  [
    "Mulholland Drive",
    "Un des films les plus canonisés du XXIe siècle.",
    "assets/grands-oublies/2000-2024/mulholland-drive.jpg"
  ],
  [
    "In the Mood for Love",
    "Autre sommet quasi universel des palmarès critiques; 0/9.",
    "assets/grands-oublies/2000-2024/in-the-mood-for-love.jpg"
  ],
  [
    "Eternal Sunshine of the Spotless Mind",
    "Le film fantôme du palmarès : concept, émotion, culte cinéphile et grand public, mais 0 vote.",
    "assets/grands-oublies/2000-2024/eternal-sunshine-of-the-spotless-mind.jpg"
  ],
  [
    "Yi Yi",
    "Monument du cinéma taïwanais et pilier du canon critique.",
    "assets/grands-oublies/2000-2024/yi-yi.jpg"
  ],
  [
    "The Tree of Life",
    "Très haut chez les critiques; son absence correspond davantage aux goûts narratifs du groupe.",
    "assets/grands-oublies/2000-2024/the-tree-of-life.jpg"
  ],
  [
    "A Separation",
    "Un des grands consensus internationaux des années 2010.",
    "assets/grands-oublies/2000-2024/a-separation.jpg"
  ],
  [
    "Portrait of a Lady on Fire",
    "Canon moderne majeur, absent des neuf listes.",
    "assets/grands-oublies/2000-2024/portrait-of-a-lady-on-fire.jpg"
  ],
  [
    "Oldboy",
    "Absence étonnante pour une gang aussi réceptive au cinéma de genre.",
    "assets/grands-oublies/2000-2024/oldboy.jpg"
  ],
  [
    "WALL-E",
    "Très surprenant vu la place de l’animation dans les listes.",
    "assets/grands-oublies/2000-2024/wall-e.jpg"
  ],
  [
    "The Master",
    "Paul Thomas Anderson est beaucoup moins présent ici que dans le canon critique.",
    "assets/grands-oublies/2000-2024/the-master.jpg"
  ],
  [
    "Roma",
    "Grand film de bilan de la décennie 2010.",
    "assets/grands-oublies/2000-2024/roma.jpg"
  ],
  [
    "Before Sunset",
    "Un des grands films romantiques/conversationnels du siècle.",
    "assets/grands-oublies/2000-2024/before-sunset.jpg"
  ],
  [
    "Lady Bird",
    "Très aimé autant par la critique que le public cinéphile.",
    "assets/grands-oublies/2000-2024/lady-bird.jpg"
  ],
  [
    "La La Land",
    "Son absence surprend davantage du côté populaire.",
    "assets/grands-oublies/2000-2024/la-la-land.jpg"
  ],
  [
    "Oppenheimer",
    "Un blockbuster d’auteur qui semblerait compatible avec les goûts visibles.",
    "assets/grands-oublies/2000-2024/oppenheimer.jpg"
  ]
];
