const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
// const bodyParser = require('body-parser');
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxn7b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("book-admin").collection("books");
  const ordersCollection = client.db("book-admin").collection("orders");

  // console.log('Database Connected');
  app.post('/addBooks', (req, res) =>{
    const newBook = req.body;
    // console.log('add new book: ', newBook);
    collection.insertOne(newBook)
    .then(result =>{
      res.send(result.insertedCount>0);
    })
  })

  // create api for loading books from database
  app.get('/books', (req, res) =>{
    collection.find()
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  // track object id
  app.get('/book/:id', (req, res) =>{
    const id = ObjectId(req.params.id);
    collection.find({_id: id})
    .toArray((err, documents) =>{
      res.send(documents);
      // console.log(documents);
    })
  })

  // second collection
  // orders api
  app.post('/addOrders', (req, res) =>{
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result =>{
      res.send(result.insertedCount>0);
    })
  })

  app.get('/orderprocess', (req, res) =>{
    ordersCollection.find({email: req.query.email})
    // ordersCollection.find({ })
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  // delete item
  app.delete('/deleteItem/:id', (req, res) =>{
    const id = ObjectId(req.params.id);
    console.log('delete: ', id);
    collection.deleteOne({_id: id})
    .then(result =>{
      // console.log(result, id);
      res.send(result.deletedCount>0);
    })
  })

//   client.close();
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})