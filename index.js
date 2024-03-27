const express = require('express');
const PORT = 3001;
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

//Import SQL
const {checkUsername, checkGiftcard} = require('./mysql/checker.js');
const { getEmailGiftcard, getUserProfile, getForgotPassword } = require('./mysql/get.js');
const { updateGiftcardEmail, updateUserPassword, updateTwoFactor, reqUserPassword, reqUserTwoFactor, reqUserRedeemGiftcard } = require('./mysql/update.js');
const {upsertUser} = require('./mysql/upsert.js');
const {login, logout} =  require('./services/login.js');
//Import NoSQL
const {findResult, setField, getFavouriteList} = require('./mongodb/database.js');
//Import services
const {EmailValidate} = require('./services/email-validate.js');
const {registerVerify} = require('./services/register-verify.js');
//Import test
const { getAllByNameQuery, getShowByNameQuery, getMovieByNameQuery, getTrendingLimit, getMostWatchLimit, getRecentAddLimit, getExclusiveLimit, getShowsLimit, getMoviesLimit, getShowcaseAll, getActionAll, getCartoonAll, getComedyAll, getCrimeAll, getDramaAll, getFantasyAll, getHorrorAll, getLgbtqAll, getRomanceAll, getScifiAll, getSuspenseAll, getThrillerAll } = require('./api/getContent.js')

const dir = path.join(__dirname, 'public');
app.use(express.static(dir));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//CONTENTS API
app.get('/showcase', getShowcaseAll);
app.get('/trending', getTrendingLimit);
app.get('/mostWatch', getMostWatchLimit);
app.get('/recentAdd', getRecentAddLimit);
app.get('/exclusive', getExclusiveLimit);
app.get('/movies', getMoviesLimit);
app.get('/shows', getShowsLimit);
app.get('/shows/:name', getShowByNameQuery);
app.get('/movies/:name', getMovieByNameQuery);
app.get('/search', getAllByNameQuery);
app.get('/cateAction', getActionAll);
app.get('/cateCartoon', getCartoonAll);
app.get('/cateComedy', getComedyAll);
app.get('/cateCrime', getCrimeAll);
app.get('/cateDrama', getDramaAll);
app.get('/cateFantasy', getFantasyAll);
app.get('/cateHorror', getHorrorAll);
app.get('/cateLGBTQ', getLgbtqAll);
app.get('/cateRomance', getRomanceAll);
app.get('/cateSciFi', getScifiAll);
app.get('/cateSuspense', getSuspenseAll);
app.get('/cateThriller', getThrillerAll);


//AUTO API
//SQL services
app.post('/regis-email_validate', EmailValidate);
app.post('/regis-username_check', checkUsername);
app.post('/regis-giftcard_check', checkGiftcard);
app.post('/regis-giftcard', updateGiftcardEmail);
app.post('/regis-credential', getEmailGiftcard);
app.post('/regis-submit', upsertUser);
app.post('/regis-activate', registerVerify);
app.post('/login', login);
app.post('/logout', logout);
app.get('/user-profile', getUserProfile);
app.post('/user-password_change', reqUserPassword);
app.post('/user-password', updateUserPassword);
app.post('/user-password_forgot', getForgotPassword);
app.post('/user-twofactor_change', reqUserTwoFactor);
app.post('/user-twofactor', updateTwoFactor);
app.post('/user-redeem', reqUserRedeemGiftcard);
//NOSQL service
app.get('/list-favourite', findResult);
app.post('/list-favourite', setField);
app.get('/list-favourite-all', getFavouriteList)

app.listen(PORT, () => {
    console.log('server is running..')
})

//res.status(200).json(contentShows_related[req.params.prim].req.params.sec)
