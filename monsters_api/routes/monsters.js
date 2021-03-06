const{Router}= require('express');
const bodyParser = require('body-parser');
const pool = require('../db');
const router = Router();
const cors = require('cors');

const configurationOptions = {
    origin : 'http://localhost:4200',
    maxAge : 3600
}
router.get('/', cors(configurationOptions),(request, response,next)=>{
    pool.query('SELECT * FROM monsters order by id asc', (err, res)=> {
        if(err) return next(err);
        response.json(res.rows);
    });
});

router.get('/:id',cors(configurationOptions), (request, response,next)=>{
 const {id} = request.params;
 pool.query('SELECT * FROM monsters WHERE id = $1', [id] ,(err, res)=> {
    if(err) return next(err);
    response.json(res.rows);
});
});

router.post('/', cors(configurationOptions),(request, response,next)=>{
    const {name,personality} = request.body;
    pool.query('INSERT INTO monsters(name,personality) VALUES($1,$2)',
      [name,personality],
       (err, res)=> {
        if(err) return next(err);
        response.redirect('/monsters');
    });
});
router.put('/:id', (request, response, next) => {
    const { id } = request.params;
    const keys = ['name', 'personality'];
    const fields = [];
  
    keys.forEach(key => {
      if (request.body[key]) fields.push(key);
    });
  
    fields.forEach((field, index) => {
      pool.query(
        `UPDATE monsters SET ${field}=($1) WHERE id=($2)`,
        [request.body[field], id],
        (err, res) => {
          if (err) return next(err);
  
          if (index === fields.length - 1) response.redirect('/monsters');
        }
      )
    });
  });
 router.delete('/:id',cors(configurationOptions), (request, response,next)=>{
     const {id} = request.params;
     pool.query('DELETE FROM monsters WHERE id=($1)', [id] ,(err, res)=> {
        if(err) return next(err);
        // response.json(res.rows);
        response.redirect('/monsters');
    });

 })



module.exports =router;