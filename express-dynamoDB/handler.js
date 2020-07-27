'use strict';
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

const USERS_TABLE = process.env.USERS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDB;

if (IS_OFFLINE === 'true') {
  dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
} else {
  dynamoDB = new AWS.DynamoDB.DocumentClient();
}

app.use(bodyParser.json({strict: false}));
//app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Hola Mundo con Expressjs');
});

app.post('/users', (req, res) => {
  const {userId, name} = req.body;

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId, name
    }
  };

  dynamoDB.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: 'No se ha podido crear el usuario!'
      })
    } else {
      res.json({userId, name});
    }
  });
});

app.get('/users', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
  };
  
  dynamoDB.scan(params, (error, data) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: 'No se ha podido acceder a los usuarios'
      })
    } else {
      const {Items} = data;
      res.json({
        success: true,
        message: 'Usuarios recuperados correctamente',
        users: Items
      });
    }
  })
});

app.get('/users/:userId', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId
    }
  };

  dynamoDB.get(params, (error, data) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: 'No se ha podido acceder al usuario'
      })
    }

    if (data.Item) {
      const {userId, name} = data.Item;
      res.json({userId, name});
    } else {
      
      res.status(400).json({
        error: 'No se ha podido acceder a los usuarios!'
      })
    }
  });
});

module.exports.generic = serverless(app);