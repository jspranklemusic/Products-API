//express
const express = require('express')
const app = express()

//body parsing middleware
const bodyParser = require('body-parser')

//the port
const PORT = process.env.PORT|3000

//the fake data generator
const faker = require('faker')

//connecting to MySQL database
const mysql = require('mysql')
const connection = mysql.createConnection({
  host     : process.env.SQL_HOST,
  user     : process.env.SQL_USER,
  password : process.env.SQL_PASS,
  database : process.env.SQL_DB
})

connection.connect()
app.use(bodyParser.urlencoded())

//CREATES A FAKE PRODUCTS TABLE
let createTable = `
    CREATE TABLE IF NOT EXISTS products(
    productName VARCHAR(255) NOT NULL,
    productType VARCHAR(255) NOT NULL,
    productDescription VARCHAR(255) NOT NULL,
    price DECIMAL(50,2) NOT NULL,
    company VARCHAR(255) NOT NULL,
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
    )
`
//INSERT SQL STATEMENT
let insertIntoTable=`
  INSERT INTO products(productName,productType,productDescription,price,company)
  VALUES(?,?,?,?,?)
`
//THESE LINES OF CODE RANDOMLY INSERT RANDOM DATA INTO THE PRODUCTS TABLE. To use, uncomment and run once.

// let c = faker.commerce
// for(let i=0;i<100;i++){
//   connection.query(insertIntoTable,[c.productName(),c.product(),c.productDescription(),c.price(),faker.company.companyName()],(err,result)=>{
//     if(err) console.log(err)
//     else console.log("Result ID: "+result.insertId)
//   })
// }

/*
QUERIES:

1. Each query MUST have an equal sign, followed by the urlencoded operator (<,=,>,etc).
For example: price=%3D5 (or 'price' + '=' + '%3D' + '5') translates to price:=5 in the query.

A urlencoded reference can be found here: https://www.w3schools.com/tags/ref_urlencode.ASP

2. For sorting, use the 'sortBy', + '=' followed by property + '%20'(space) + 'ASC'|'DESC' + '%2C' (comma). Translates to sortBy:"price ASC,productName DESC".
For example: sortBy=price%20ASC%2CproductName%20DESC 

sortBy must come first.

3. If more than one query, use '&' to separate them. Again, sortBy must come first.

4. If you want to limit results, do limit=20 or something like that. Simple.

5. If you want pagination (page 2, etc.) you must first have a limit with the number of results, followed by the page number (with each page containing n results) with a minimum of page 1.

Example: limit=5&page=2

6. A big query could look like: /?price=%3C100&sortBy=price%20ASC%2CproductName%20DESC&limit=5&page=2

 */

app.get('/',async (req,res)=>{
let keys = Object.keys(req.query)
let selectValues=`
  SELECT * FROM products
`
//loops through all of the queries and creates SQL code
if(keys.length>0){
  for(i=0;i<keys.length;i++){
    //creates a LIMIT query
    if(keys[i]=='limit'){
      selectValues+=` LIMIT ${req.query.limit} `;
    }
    //creates an OFFSET query (in pages) if you have a LIMIT
    else if(keys[i]=='page'){
      selectValues+=`OFFSET ${req.query.limit*(req.query.page - 1)} `
    }
    //creates a SORTBY query
    else if(keys[i]=="sortBy"){
      selectValues+=` ORDER BY ${req.query.sortBy}`
    //creates a WHERE query with <,=,> etc. operators
    }else{
      if(i==0) selectValues+=" WHERE ";
      selectValues+=`${keys[i]+req.query[keys[i]]}`
      //this line adds AND if you have more than one operator
      if(i<keys.length-1&&keys[i+1]!="sortBy"&&keys[i+1]!="limit") {
        selectValues+=" AND "
        }
    }
  }

}

//It tells you what your query was, after being interpreted
console.log("Your SQL query: " + selectValues)
  connection.query(selectValues,(err,result)=>{
    if(err) return res.status(500).send('Whoops... had a little error.')
    else return res.send(result)
  })
})

//creates a server
app.listen(PORT,()=>{
  console.log(`listening on port: ${PORT}`)
})