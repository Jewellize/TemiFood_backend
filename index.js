const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd() + "/public"));


const connection = mysql.createConnection({
  // host: "localhost",
  // user: "root",
  // password: "1234",
  // database: "food",
  // port: "3307"

  // host: "fvw.h.filess.io",
  // user: "DataTemiFood_cellplusmy",
  // password: "317e18cbe915a32e93991d74272e5f897cfc4480",
  // database: "DataTemiFood_cellplusmy",
  // port: "3307"
  host: "knv.h.filess.io",
  user: "TemiFoodData_unknownfor",
  password: "9e6bab849389e21541cd26477af3ba1acfe48dbe",
  database: "TemiFoodData_unknownfor",
  port: "3307"
});
// console.log(connection)



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'https://temi-food-backend.vercel.app/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

// connection.query(
//   'SELECT * FROM products',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//   }
// );



// let [result] = con.query('SELECT * FROM dsd')
// console.log(result)

// get
app.get('/alldata', function (req, res) {
  connection.query(
    'SELECT * FROM products',
    function(err, results, fields) {
      if(err){
        console.log(err)
        res.send({message: err})
      }
      else{
        console.log(results); // results contains rows returned by server
        res.json(results);
      }

    }
  );
  
})

//post images
app.post('/uploads',upload.single('image') ,(req, res) => {
  const image = req.file.filename;
  const name = req.body.name;
  const price = req.body.price;
  const sql = "INSERT INTO products(name,price,image) VALUES(?,?,?)"

  connection.query(sql, [name,price,image], (err, result) => {
    if(err) return res.json({Message: "Error"});
    return res.json({Status: "Success"});
  })
  
})

//post cart to database
app.post('/products', jsonParser, function (req, res, next) {
  console.log(req.body);
  const bulkfood = req.body.data;
  const ordertime = req.body.ordertime;
  const numoftable = req.body.table;
  const totalprice = req.body.total;
  const tableId = req.body.tableId;
  connection.execute(
      'INSERT INTO `payment_bill` (bulkfood, cookstatus, ordertime, numoftable, tables_idtables, totalprice) VALUES (?, ?, ?, ?, ?, ?)',
      [JSON.stringify(bulkfood), 0, ordertime, numoftable, tableId, totalprice],
      function(err, results, fields) {
        if (err) {
          console.log(err);
          res.json({status: 'error', message: err})
          return
        }
        console.log('ok')
        res.json({status: 'ok'})

      }
    );

})

//update cart
app.post('/updatestatus/:id', jsonParser, function (req, res, next) {
  // console.log(req.body);
  const tableId = req.params.id;
  // console.log(bulkfood);
  // console.log(req.body);

  connection.execute(
      `UPDATE tables SET temistatus = 1 WHERE idtables = ${tableId}`,
      function(err, results, fields) {
        if (err) {
          console.log(err);
          res.json({status: 'error', message: err})
          return
        }
        console.log('ok')
        res.json({status: 'ok'})

      }
    );

})

app.get('/showorder', function (req, res) {
  connection.query(
    'SELECT * FROM payment_bill',
    function(err, results, fields) {
      if(err){
        console.log(err)
        res.send({message: err})
      }
      else{
        console.log(results); // results contains rows returned by server
        res.json(results);
      }

    }
  );
})

//post cookstatus
app.post('/updatecookstatus/:id', jsonParser, function (req, res, next) {
  // console.log(req.body);
  const orderId = req.params.id;
  const updateValue = req.body.updateValue;
  // console.log(bulkfood);
  // console.log(req.body);

  connection.execute(
      `UPDATE payment_bill SET cookstatus = ${updateValue} WHERE id = ${orderId}`,
      function(err, results, fields) {
        if (err) {
          console.log(err);
          res.json({status: 'error', message: err})
          return
        }
        console.log('ok')
        res.json({status: 'ok'})

      }
    );

})

//get tables
app.get('/tables', function (req, res) {
  connection.query(
    'SELECT * FROM tables WHERE temistatus = 0 ORDER BY tabletimestamp ASC LIMIT 1',
    function(err, results, fields) {
      if(err){
        console.log(err)
        res.send({message: err})
      }
      else{
        console.log(results); // results contains rows returned by server
        res.json(results);
      }

    }
  );
})





app.listen(3000)