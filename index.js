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
  host: "fvw.h.filess.io",
  user: "DataTemiFood_cellplusmy",
  password: "317e18cbe915a32e93991d74272e5f897cfc4480",
  database: "DataTemiFood_cellplusmy",
  port: "3307"
});
console.log(connection)



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'https://temi-food-backend.vercel.app/public/images')
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
  connection.execute(
      'INSERT INTO `payment_bill` (food_qty, total) VALUES (?, ?)',
      [req.body.food_qty, req.body.total],
      function(err, results, fields) {
        if (err) {
          res.json({status: 'error', message: err})
          return
        }
        res.json({status: 'ok'})

      }
    );

})






app.listen(3000)