const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer')
const path = require('path')

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
  host: "y44.h.filess.io",
  user: "temifood_automobile",
  password: "33580e813951c7b871a938cbb5433009eb78ce69",
  database: "temifood_automobile",
  port: "3307"
});
console.log(connection)



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
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

app.listen(3000)