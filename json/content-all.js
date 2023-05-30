//for searching
const contentsAll = {
    'downton abby': {
        'title': 'Downton Abby',
        'img': '/img/downton-abbey.webp',
        'url': '/contents_show?n=downton-abbey-season-1'
    },
    '13 reasons why': {
        'title': '13 Reasons Why',
        'img': '13-reasons-why.webp',
        'url': '/contents_show?n=13-reasons-why-season-1'
    },
    'money heist': {
        'title': 'Money Heist',
        'img': '/img/money-heist.webp',
        'url': '/contents_show?n=money-heist-season-1'
    },
    'american horror story': {
        'title': 'American Horror Story',
        'img': '/img/ahs.webp',
        'url': '/contents_show?n=american-horror-story-season-1'
    },
    'tom clancy jack ryan': {
        'title': 'Tom Clancy\'\s: Jack Ryan',
        'img': '/img/jack-ryan.webp',
        'url': '/contents_show?n=jack-ryan-season-1'
    },
    'house of the dragon': {
        'title': 'House of the Dragon',
        'img': '/img/house-of-dragon.webp',
        'url': '/contents_show?n=house-of-dragon-season-1'
    },
    'dahmer': {
        'title': 'Dahmer',
        'img': '/img/dahmer.webp',
        'url': '/contents_show?n=dahmer-season-1'
    },
    'breaking bad': {
        'title': 'Breaking Bad',
        'img': '/img/breaking-bad.webp',
        'url': '/contents_show?n=breaking-bad-season-1'
    },
    'the serpent queen': {
        'title': 'The Serpent Queen',
        'img': '/img/the-serpent-queen.webp',
        'url': '/contents_show?n=the-serpent-queen-season-1'
    },
    'the handmaid tale': {
        'title': 'The Handmaid\'\s Tale',
        'img': '/img/the-handmaid-tale.webp',
        'url': '/contents_show?n=the-handmaids-tale-season-1'
    },
    'a series of unfortunate events': {
        'title': 'A Series of Unfortunate Events',
        'img': '/img/a-series-of-unfortunate-events.webp',
        'url': '/contents_show?n=a-series-of-unfortunate-events-season-1'
    },
    'the marvelous mrs. maisel': {
        'title': 'The Marvelous Mrs. Maisel',
        'img': '/img/the-mavelous-mrs-maisel.webp',
        'url': '/contents_show?n=the-marvelous-mrs-maisel-season-1'
    },
    'homecoming': {
        'title': 'Homecoming',
        'img': '/img/homecoming.webp',
        'url': '/contents_show?n=homecoming-season-1'
    },
    'mr robot': {
        'title': 'Mr. Robot',
        'img': '/img/MrRobot.webp',
        'url': '/contents_show?n=mr-robot-season-1'
    },
    'sharp objects': {
        'title': 'Sharp Objects',
        'img': '/img/Sharp Objects.webp',
        'url': '/contents_show?n=sharp-objects-season-1'
    },
    'the good doctor': {
        'title': 'The Good Doctor',
        'img': '/img/The Good Doctor.webp',
        'url': '/contents_show?n=the-good-doctor-season-1'
    },
    'the good wife': {
        'title': 'The Good Wife',
        'img': '/img/the-good-wife.webp',
        'url': '/contents_show?n=the-good-wife-season-1'
    },
    'the good fight': {
        'title': 'The Good Fight',
        'img': '/img/The Good Fight.webp',
        'url': '/contents_show?n=the-good-fight-season-1'
    },
    'homeland': {
        'title': 'Homeland',
        'img': '/img/Homeland.webp',
        'url': '/contents_show?n=homeland-season-1'
    },
    'prison break': {
        'title': 'Prison Break',
        'img': '/img/Prison Break.webp',
        'url': '/contents_show?n=prison-break-season-1'
    },
    'american crime story': {
        'title': 'American Crime Story',
        'img': '/img/American Crime Story.webp',
        'url': '/contents_show?n=american-crime-story-season-1'
    },
    'the americans': {
        'title': 'The Americans',
        'img': '/img/The Americans.webp',
        'url': '/contents_show?n=the-americans-season-1'
    },
    'big little lies': {
        'title': 'Big Little Lies',
        'img': '/img/Big Little Lies.webp',
        'url': '/contents_show?n=big-little-lies-season-1'
    },
    'the punisher': {
        'title': 'The Punisher',
        'img': '/img/the-punisher.webp',
        'url': '/contents_show?n=the-punisher-season-1'
    },
    'hannibal': {
        'title': 'Hannibal',
        'img': '/img/Hannibal.webp',
        'url': '/contents_show?n=hannibal-season-1'
    },
    'bullet train': {
        'title': 'Bullet Train',
        'img': '/img/movies/bullet-train',
        'url': '/contents_movie?n=bullet-train'
    },
    'elvis': {
        'title': 'Elvis',
        'img': '/img/movies/elvis',
        'url': '/contents_movie?n=elvis'
    },
    'where the crawdads sing': {
        'title': 'Where the Crawdads Sing',
        'img': '/img/movies/where-the-crawdads-sing',
        'url': '/contents_movie?n=where-the-crawdads-sing'
    },
    'the batman': {
        'title': 'The Batman',
        'img': '/img/movies/the-batman',
        'url': '/contents_movie?n=the-batman'
    },
    'top gun: maverick': {
        'title': 'Top Gun: Maverick',
        'img': '/img/movies/top-gun',
        'url': '/contents_movie?n=top-gun-maverick'
    },
    'doctor strange in the multiverse of madness': {
        'title': 'Dr Strange: in the Multiverse of Madness',
        'img': '/img/movies/dr-strange-in-the-multiverse-of-madness.webp',
        'url': '/contents_movie?n=doctor-strange-in-the-multiverse-of-madness'
    },
    'scream': {
        'title': 'Scream',
        'img': '/img/movies/scream.webp',
        'url': '/contents_movie?n=scream'
    },
    'titanic': {
        'title': 'Titanic',
        'img': '/img/movies/titanic.webp',
        'url': '/contents_movie?n=titanic'
    },
    'star war a new hope': {
        'title': 'Star War: A New Hope',
        'img': '/img/movies/a-new-hope.webp',
        'url': '/contents_movie?n=star-war-a-new-hope'
    },
    'the lord of the rings the return of the king': {
        'title': 'The Lord of the Rings: The Return of the King',
        'img': '/img/movies/the-return-of-the-king.webp',
        'url': '/contents_movie?n=the-lord-of-the-rings-the-return-of-the-king'
    },
    'the lion king': {
        'title': 'The Lion King',
        'img': '/img/movies/the-lion-king.webp',
        'url': '/contents_movie?n=the-lion-king'
    },
    'the shawshank redemption': {
        'title': 'The Shawshank Redemption',
        'img': '/img/movies/TheShawshankRedemption',
        'url': '/contents_movie?n=the-shawshank-redemption'
    },
    'the godfather': {
        'title': 'The Godfather',
        'img': '/img/movies/TheGodfather',
        'url': '/contents_movie?n=the-godfather'
    },
    'the dark knight': {
        'title': 'The Dark Knight',
        'img': '/img/movies/TheGodfather',
        'url': '/contents_movie?n=the-dark-knight'
    },
    'the godfather part 2': {
        'title': 'The Godfather Part II',
        'img': '/img/movies/TheGodfather',
        'url': '/contents_movie?n=the-godfather-part-ii'
    },
    '12 angry men': {
        'title': '12 Angry Men',
        'img': '/img/movies/12AngryMen',
        'url': '/contents_movie?n=12-angry-men'
    },
    'schindlers list': {
        'title': 'Schindler\'\s List',
        'img': '/img/movies/SchindlerList',
        'url': '/contents_movie?n=schindlers-list'
    },
    'pulp fiction': {
        'title': 'Pulp Fiction',
        'img': '/img/movies/PulpFiction',
        'url': '/contents_movie?n=pulp-fiction'
    },
    'the lord of the rings: the fellowship of the ring': {
        'title': 'The Lord of the Rings: The Fellowship of the Ring',
        'img': '/img/movies/TheFellowshipoftheRing',
        'url': '/contents_movie?n=the-lord-of-the-rings-the-fellowship-of-the-ring'
    },
    'fight club': {
        'title': 'Fight Club',
        'img': '/img/movies/FightClub',
        'url': '/contents_movie?n=fight-club'
    },
    'inception': {
        'title': 'Inception',
        'img': '/img/movies/Inception',
        'url': '/contents_movie?n=inception'
    },
    'the lord of the rings the two towers': {
        'title': 'The Lord of the Rings: The Two Towers',
        'img': '/img/movies/theTwoTowers',
        'url': '/contents_movie?n=the-lord-of-the-rings-the-two-towers'
    },
    'star wars: episode v the empire strikes back': {
        'title': 'Star Wars: Episode V - The Empire Strikes Back ',
        'img': '/img/movies/theEmpireStrikesBack',
        'url': '/contents_movie?n=star-wars-episodes-v-the-empire-strikes-back'
    },
    'the matrix': {
        'title': ' The Matrix',
        'img': '/img/movies/TheMatrix',
        'url': '/contents_movie?n=the-matrix'
    },
    'black panther': {
        'title': 'Black Panther',
        'img': '/img/movies/BlackPanther',
        'url': '/contents_movie?n=black-panther'
    },
    'once upon a time in hollywood': {
        'title': 'Once Upon a Time…in Hollywood',
        'img': '/img/movies/OnceUponaTimeinHollywood',
        'url': '/contents_movie?n=once-upon-a-time-in-hollywood'
    },
    'lincoln': {
        'title': 'Lincoln',
        'img': '/img/movies/Lincoln',
        'url': '/contents_movie?n=lincoln'
    },
    'call me by your name': {
        'title': 'Call Me By Your Name',
        'img': '/img/movies/CallMeByYourName',
        'url': '/contents_movie?n=call-me-by-your-name'
    },
    'dunkirk': {
        'title': 'Dunkirk',
        'img': '/img/movies/Dunkirk',
        'url': '/contents_movie?n=dunkirk'
    },
    'parasite': {
        'title': 'Parasite',
        'img': '/img/movies/Parasite',
        'url': '/contents_movie?n=parasite'
    },
    'minion': {
        'title': 'Minion: The Rise of Gru',
        'img': '/img/movies/minion-the-rise-of-gru.webp',
        'url': '/contents_movie?n=minion-the-rise-of-gru'
    },
    'sonic the hedgehog 2': {
        'title': 'Sonic the Hedgehog 2',
        'img': '/img/movies/sonic-the-hedgehog-2.webp',
        'url': '/contents_movie?n=sonic-the-hedgehog-2'
    },
    'scream': {
        'title': 'Scream',
        'img': '/img/movies/scream.webp',
        'url': '/contents_movie?n=scream'
    },
    'one piece red': {
        'title': 'One Piece: Red',
        'img': '/img/movies/one-piece-red.webp',
        'url': '/contents_movie?n=one-piece-red'
    },
    'dc league of super pets': {
        'title': 'DC League of Super Pets',
        'img': '/img/movies/dc-league-of-super-pets.webp',
        'url': '/contents_movie?n=dc-league-of-super-pets'
    },
    'interstellar': {
        'title': 'Interstellar',
        'img': '/img/movies/interstellar.webp',
        'url': '/contents_movie?n=interstellar'
    },
    'shrek': {
        'title': 'Shrek',
        'img': '/img/movies/shrek.webp',
        'url': '/contents_movie?n=shrek'
    },
    'game of throne': {
        'title': 'Game of Throne',
        'img': '/img/most-watch/game-of-throne.webp',
        'url': '/contents_show?n=game-of-throne-season-1'
    },
    'the crown': {
        'title': 'The Crown',
        'img': '/img/trend/the-crown.webp',
        'url': '/contents_show?n=the-crown-season-1'
    },
    'law and order': {
        'title': 'Law & Order',
        'img': '/img/recent-add/law-n-order.webp',
        'url': '/contents_show?n=law-n-order-season-1'
    },
    'chicago pd': {
        'title': 'Chicago P.D',
        'img': '/img/recent-add/chicago-pd.webp',
        'url': '/contents_show?n=chicago-pd-season-1'
    },
    'tell me lies': {
        'title': 'Tell Me Lies',
        'img': '/img/exclusive/tell-me-lies.webp',
        'url': '/contents_show?n=tell-me-lies-season-1'
    },
    'homecoming': {
        'title': 'Homecoming',
        'img': '/img/exclusive/homecoming.webp',
        'url': '/contents_show?n=homecoming-season-1'
    }
};
//last updated Nov 10, 2022
module.exports = { contentsAll };
