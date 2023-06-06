const { MongoClient } = require('mongodb');
require('dotenv').config()
const baseKeyApi = process.env.BASEKEY_API;
const MongoClients = require('mongodb').MongoClient

//const url = 'mongodb://localhost:27017';
const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const dbName = 'favourite';
const collection = client.db(dbName).collection('list');


async function findResult(req, res) {
  let api_key = req.headers['api-key'];
  let user_token = req.headers['user-token'];
  let title = req.query.title;

  if (api_key === baseKeyApi) {
    switch (user_token) {
      case null: case undefined:
        res.send(401);
        break;
      default:
        await client.connect();
        //console.log('Connected successfully to server');

        const findResult = await collection.find({ token: user_token }).toArray();
        //console.log('Found documents =>', findResult);

        //console.log(findResult)
        switch (findResult[0]) {
          case null: case undefined:
            res.sendStatus(401);
            break;
          default:

            switch (findResult[0][title]) {
              case null: case undefined:
                //console.log('you do not have favourite list yet');
                res.json({ status: false });
                break;
              default:
                res.json({ status: true, data: findResult[0][title] });
                break;
            }

            break;
        }

        //const timestamp = Date.now();
        //console.log(Math.floor(timestamp/1000));

        return 'done.';
    }
  }
  if (api_key != baseKeyApi) {
    res.send(402);
  }
}

async function setField(req, res) {
  let api_key = req.headers['api-key'];
  let user_token = req.headers['user-token'];
  const content_title = req.body.title;
  const content_bool = req.body.bool;

  if (api_key === baseKeyApi) {
    switch (user_token) {
      case null: case undefined:
        res.send(401);
        break;
      default:
        await client.connect();
        //console.log('Connected successfully to server');

        const findUser = await collection.find({ token: user_token }).toArray();

        switch (findUser[0]) {
          case null: case undefined:
            res.sendStatus(401);
            break;
          default:
            const updateResult = await collection.updateOne({ token: user_token }, { $set: { [content_title]: content_bool } });

            switch (updateResult.modifiedCount) {
              case 1:
                //find bool value in result
                const findUser = await collection.find({ token: user_token }).toArray();
                let userResult = findUser[0];
                //switch case bool
                switch (userResult[content_title]) {
                  //true => $addToSet
                  case true:
                    //console.log(`${content_title} in data: [] is not exit, use $ADDTOSET`);
                    const updateObject = await collection.updateOne({ token: user_token }, { $addToSet: { 'data': { title: content_title } } });
                    res.send({ status: true, msg: 'Successfully saved!' });
                    break;
                  //false => $pull (remove in data: [])
                  case false:
                    //console.log(`${content_title} in data: [] is exit, use PULL`);
                    const updateResult = await collection.updateOne({ token: user_token }, { $pull: { 'data': { title: content_title } } });
                    res.send({ status: true, msg: 'Successfully saved!' });
                    break;
                  default:
                    res.send({ status: true, msg: 'content_title is not exit in findUser[0]' });
                    break;
                }

                break;
              case 0: default:
                res.send({ status: false, msg: 'Failed to save wishlist' });
                break;
            }
            break;
        }
        return;
    }
  }
  if (api_key != baseKeyApi) {
    res.send(402);
  }
}

async function getFavouriteList(req, res) {
  let api_key = req.headers['api-key'];
  let user_token = req.headers['user-token'];

  if (api_key === baseKeyApi) {
    switch (user_token) {
      case null: case undefined:
        res.send(401);
        break;
      default:
        await client.connect();
        const findUser = await collection.find({ token: user_token }).toArray();
        let userResult = findUser[0];

        switch (userResult) {
          case null: case undefined:
            res.sendStatus(401)
            break;
          default:
            switch (userResult.data) {
              case null: case undefined:

                res.json({ status: false, data: [] });
                break;
              default:
                res.json({ status: true, data: userResult.data });
                break;
            }
            break;
        }

    }
  }
  if (api_key != baseKeyApi) {
    res.sendStatus(402);
  }


}
module.exports = { findResult, setField, getFavouriteList };

/*
async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('test');
  
    // the following code examples can be pasted here...
    const updateResult = await collection.updateOne({ user: 'bbb@gmail.com' }, { $set: { 'the-good-wife-season-1': false } });
    console.log(updateResult);
  
    const findResult = await collection.find({ user: 'bbb@gmail.com' }).toArray();
    console.log('Found documents =>', findResult);
  
    return 'done.';
  }
  
  main()
    .then(console.log)
    .catch(console.error)
  //.finally(() => client.close());
  */
