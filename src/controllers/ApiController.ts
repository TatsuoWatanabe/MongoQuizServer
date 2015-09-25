import express  = require('express');
import mongoose = require('mongoose');
import Category = require('../models/Category');
import Quiz     = require('../models/Quiz');
import Pager    = require('../lib/Pager');

class ApiController {
  public static paths = {
    index    : '/api'
  }

  public static index(req: express.Request, res: express.Response) {
    res.header('Access-Control-Allow-Origin', '*');

    var limit = Number(req.query.limit) || 10;
    var query = Quiz.model.find({})
                          .limit(limit)
                          .where({ active: true})
                          .where({ random: {$near: [Math.random(), Math.random()]} })
                          .populate({ path: 'categories' });
    query.exec((err, results) => {
      res.send(results);
    });
  }
    
}

export = ApiController;
