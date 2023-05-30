const pool = require('../mysql/database');
const baseApiKey = require("../api-key");

//Import json
const originHome = require('../json/content-home.js');
const originMovies = require('../json/cate-movies.js');
const originShows = require('../json/cate-shows.js');
const originContentShows = require('../json/content-shows.js');
const originContentMovies = require('../json/content-movies.js');
const originContentAll = require('../json/content-all.js');
const originCateAction = require('../json/cate-action.js');
const originCateCartoon = require('../json/cate-cartoon.js');
const originCateComedy = require('../json/cate-comedy.js');
const originCateCrime = require('../json/cate-crime.js');
const originCateDrama = require('../json/cate-drama.js');
const originCateFantasy = require('../json/cate-fantasy.js');
const originCateHorror = require('../json/cate-horror.js');
const originCateLGBTQ = require('../json/cate-lgbtq.js');
const originCateRomance = require('../json/cate-romance.js');
const originCateSciFi = require('../json/cate-sci-fi.js');
const originCateSuspense = require('../json/cate-suspense.js');
const originCateThriller = require('../json/cate-thriller.js');

//Origin Json
const showcase = originHome.showcase;
const trending = originHome.trending;
const mostWatch = originHome.mostWatching;
const recentAdd = originHome.recentAdd;
const exclusive = originHome.exclusive;
const movies = originMovies.movies;
const shows = originShows.shows;
const contentShows = originContentShows.contentShows;
const contentMovies = originContentMovies.contentMovies;
const contentAll = originContentAll.contentsAll;
const action = originCateAction.action;
const cartoon = originCateCartoon.cartoon;
const comedy = originCateComedy.comedy;
const crime = originCateCrime.crime;
const drama = originCateDrama.drama;
const fantasy = originCateFantasy.fantasy;
const horror = originCateHorror.horror;
const lgbtq = originCateLGBTQ.lgbtq;
const romance = originCateRomance.romance;
const scifi = originCateSciFi.scifi;
const suspense = originCateSuspense.suspense;
const thriller = originCateThriller.thriller;

//Copy Json
const trendingCopy = trending;
const mostWatchCopy = mostWatch;
const recentAddCopy = recentAdd;
const exclusiveCopy = exclusive;
const moviesCopy = movies;
const showsCopy = shows;


//Class function
class JsonLimit {
    constructor(mainJson) {
        this.mainJson = mainJson;
    }

    onCalculate(req, res) {
        const getJson = this.mainJson;
        let api_key = req.headers.api_key;
        let user_token = req.headers.user_token;
        const limit_str = req.query.limit; //pass
        const page_str = req.query.page; //pass
        const limit = Number(limit_str)
        const page = Number(page_str)
        let range = getJson.length; //pass
        const remain_mod = range % limit; //pass
        const remain_devided_float = range / limit;
        const remain_devided_int = Math.floor(remain_devided_float);
        let totalPage;
        let status;
        var output = [];

        if (api_key === baseApiKey) {
            if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        if ((limit > 0) && (limit <= range)) {
                            //check remain step: II
                            if ((range) % limit === 0) {
                                //console.log('no remain');
                                totalPage = remain_devided_int - 1;
                                //console.log('totalPage: ' + totalPage)
                                //normal push logic
                                //page = total page
                                //page > total page
                                if (page <= totalPage) {
                                    //normal push
                                    for (let i = 0; i < range - (range - (limit * (page + 1))); i++) { //pass
                                        if (i > -1 + (limit * page)) {
                                            status = true;
                                            output.push(getJson[i]);
                                        }
                                    }
                                }
                                if (page > totalPage) {
                                    //console.log('out of page, no push')
                                    status = false;
                                    output = 'reach out of page, no more content'
                                }
                                if (page < 0) {
                                    //console.log('wrong input page')
                                    output = 'page must start with 0'
                                }
                            }
                            if ((range) % limit >= 1) {
                                //console.log('got remain')
                                //abnormal push logic
                                //final
                                totalPage = remain_devided_int;
                                //console.log('totalPage: ' + totalPage)

                                if (page === totalPage) {
                                    //console.log('page = totalPage')
                                    //abnormal push
                                    //console.log('abnormal push')
                                    for (let i = 0; i < range; i++) {
                                        if ((i > (range - 1) - remain_mod) && (i <= range)) {
                                            status = true;
                                            output.push(getJson[i])
                                        }

                                    }
                                }
                                if ((page >= 0) && (page < totalPage)) {
                                    //normal push
                                    //console.log('normal push')
                                    for (let i = 0; i < range - (range - (limit * (page + 1))); i++) { //pass
                                        if (i > -1 + (limit * page)) {
                                            status = true;
                                            output.push(getJson[i])
                                        }
                                    }
                                }
                                if (page > totalPage) {
                                    //no push
                                    //console.log('out of page, no push')
                                    status = false;
                                    output = 'no more content'
                                }
                                if (page < 0) {
                                    output = 'page must be start with 0'
                                }
                            }
                            if ((range) % limit <= -1) {
                                //console.log('nan remain something broke')
                                //no push
                            }

                            //console.log('limit pass')
                        }
                        else {
                            //console.log(`limit must less than or equal ${range}`)
                        }
                        //console.log(range)
                        //console.log('+++')

                        res.status(200).json({ status, page_end: totalPage, page_start: 0, results: output });
                        break;
                }
            });
            return;
        }
        if (api_key != baseApiKey) {
            res.sendStatus(402);
            return;
        }

        /*if ((limit > 0) && (limit <= range)) {
            //check remain step: II
            if ((range) % limit === 0) {
                console.log('no remain');
                totalPage = remain_devided_int - 1;
                console.log('totalPage: ' + totalPage)
                //normal push logic
                //page = total page
                //page > total page
                if (page <= totalPage) {
                    //normal push
                    for (let i = 0; i < range - (range - (limit * (page + 1))); i++) { //pass
                        if (i > -1 + (limit * page)) {
                            status = true;
                            output.push(getJson[i]);
                        }
                    }
                }
                if (page > totalPage) {
                    //console.log('out of page, no push')
                    status = false;
                    output = 'reach out of page, no more content'
                }
                if (page < 0) {
                    //console.log('wrong input page')
                    output = 'page must start with 0'
                }
            }
            if ((range) % limit >= 1) {
                console.log('got remain')
                //abnormal push logic
                //final
                totalPage = remain_devided_int;
                console.log('totalPage: ' + totalPage)

                if (page === totalPage) {
                    console.log('page = totalPage')
                    //abnormal push
                    console.log('abnormal push')
                    for (let i = 0; i < range; i++) {
                        if ((i > (range - 1) - remain_mod) && (i <= range)) {
                            status = true;
                            output.push(getJson[i])
                        }

                    }
                }
                if ((page >= 0) && (page < totalPage)) {
                    //normal push
                    console.log('normal push')
                    for (let i = 0; i < range - (range - (limit * (page + 1))); i++) { //pass
                        if (i > -1 + (limit * page)) {
                            status = true;
                            output.push(getJson[i])
                        }
                    }
                }
                if (page > totalPage) {
                    //no push
                    console.log('out of page, no push')
                    status = false;
                    output = 'no more content'
                }
                if (page < 0) {
                    output = 'page must be start with 0'
                }
            }
            if ((range) % limit <= -1) {
                console.log('nan remain something broke')
                //no push
            }

            console.log('limit pass')
        }
        else {
            console.log(`limit must less than or equal ${range}`)
        }
        console.log(range)
        console.log('+++')
        res.status(200).json({ status, page_end: totalPage, page_start: 0, results: output });*/

    }
}

class JsonAll {
    constructor(mainJson) {
        this.mainJson = mainJson;
    }

    onCalculate(req, res) {
        const getJson = this.mainJson;
        let api_key = req.headers.api_key;
        let user_token = req.headers.user_token;

        if (api_key === baseApiKey) {
            if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch(result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        res.json(getJson);
                        break;
                }
            });
            return;
        }
        if (api_key != baseApiKey) {
            res.sendStatus(402);
            return;
        }
    }
}

//Run Class function
var getTrending = new JsonLimit(trendingCopy);
var getMostWatch = new JsonLimit(mostWatchCopy);
var getRecentAdd = new JsonLimit(recentAddCopy);
var getExclusive = new JsonLimit(exclusiveCopy);
var getMovies = new JsonLimit(moviesCopy);
var getShows = new JsonLimit(showsCopy);

var getShowcase = new JsonAll(showcase);
var getAction = new JsonAll(action);
var getCartoon = new JsonAll(cartoon);
var getComedy = new JsonAll(comedy);
var getCrime = new JsonAll(crime);
var getDrama = new JsonAll(drama);
var getFantasy = new JsonAll(fantasy);
var getHorror = new JsonAll(horror);
var getLgbtq = new JsonAll(lgbtq);
var getRomance = new JsonAll(romance);
var getScifi = new JsonAll(scifi);
var getSuspense = new JsonAll(suspense);
var getThriller = new JsonAll(thriller);

/*const getShowcase = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

        pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    res.sendStatus(401);
                    break;
                default:
                    //output
                    res.send(showcase);
                    break;
            }
        });
        return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getTrendingAll = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

        pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    res.sendStatus(401);
                    break;
                default:
                    //output
                    res.status(200).json(trending)
                    break;

            }
        });
        return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getMostWatchAll = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.status(200).json(mostWatch)
                        break;

                }
            });
            return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getRecentAddAll = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }
   
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.status(200).json(recentAdd)
                        break;

                }
            });
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getExclusiveAll = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.status(200).json(exclusive)
                        break;

                }
            });
            return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}*/

//new api
/*const getCateAction = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(action);
                        break;
                }
            });
            return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateCartoon = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(cartoon);
                        break;
                }
            });
            return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateComedy = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(comedy);
                        break;
                }
            });
            return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateCrime = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(crime);
                        break;
                }
            });
            return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateDrama = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }

            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(drama);
                        break;
                }
            });
            return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateFantasy = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) { res.sendStatus(401); return; }
        if (user_token) {
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(fantasy);
                        break;
                }
            });
            return;
        }
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateHorror = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        if (user_token) {
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(horror);
                        break;
                }
            });
            return;
        }
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateLGBTQ = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        if (user_token) {
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(lgbtq);
                        break;
                }
            });
            return;
        }
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateRomance = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        if (user_token) {
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(romance);
                        break;
                }
            });
            return;
        }
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateSciFi = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        if (user_token) {
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(scifi);
                        break;
                }
            });
            return;
        }
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateSuspense = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        if (user_token) {
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(suspense);
                        break;
                }
            });
            return;
        }
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getCateThriller = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        if (user_token) {
            pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
                if (err) throw err;

                switch (result[0]) {
                    case null: case undefined:
                        res.sendStatus(401);
                        break;
                    default:
                        //output
                        res.send(thriller);
                        break;
                }
            });
            return;
        }
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}*/


function getAllByNameQuery(req, res) {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        pool.query('SELECT * FROM user WHERE BINARY access_token = ?', user_token, (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    res.sendStatus(401);
                    break;
                default:
                    //output
                    res.status(200).json(contentAll[req.query.name])
                    break;

            }
        });
        return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}

const getShowByNameQuery = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        res.status(200).json(contentShows[req.params.name])

    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}
const getMovieByNameQuery = (req, res) => {
    let api_key = req.headers.api_key;
    let user_token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!user_token) {
            res.sendStatus(401);
            return;
        }
        res.status(200).json(contentMovies[req.params.name]);
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}

let getTrendingLimit = getTrending.onCalculate.bind(getTrending);
let getMostWatchLimit = getMostWatch.onCalculate.bind(getMostWatch);
let getRecentAddLimit = getRecentAdd.onCalculate.bind(getRecentAdd);
let getExclusiveLimit = getExclusive.onCalculate.bind(getExclusive);
let getShowsLimit = getMovies.onCalculate.bind(getShows);
let getMoviesLimit = getMovies.onCalculate.bind(getMovies);
let getShowcaseAll = getShowcase.onCalculate.bind(getShowcase);
let getActionAll = getAction.onCalculate.bind(getAction);
let getCartoonAll = getCartoon.onCalculate.bind(getCartoon);
let getComedyAll = getComedy.onCalculate.bind(getComedy);
let getCrimeAll = getCrime.onCalculate.bind(getCrime);
let getDramaAll = getDrama.onCalculate.bind(getDrama);
let getFantasyAll = getFantasy.onCalculate.bind(getFantasy);
let getHorrorAll = getHorror.onCalculate.bind(getHorror);
let getLgbtqAll = getLgbtq.onCalculate.bind(getLgbtq);
let getRomanceAll = getRomance.onCalculate.bind(getRomance);
let getScifiAll = getScifi.onCalculate.bind(getScifi);
let getSuspenseAll = getSuspense.onCalculate.bind(getSuspense);
let getThrillerAll = getThriller.onCalculate.bind(getThriller);


module.exports = { getAllByNameQuery, getShowByNameQuery, getMovieByNameQuery, getTrendingLimit, getMostWatchLimit, getRecentAddLimit, getExclusiveLimit, getShowsLimit, getMoviesLimit, getShowcaseAll, getActionAll, getCartoonAll, getComedyAll, getCrimeAll, getDramaAll, getFantasyAll, getHorrorAll, getLgbtqAll, getRomanceAll, getScifiAll, getSuspenseAll, getThrillerAll };
