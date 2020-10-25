const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()


const app = express()
app.use(bodyParser.json())
app.use(cors())
const ObjectId = require('mongodb').ObjectId;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lb4b8.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const collection = client.db("volunteerNetwork").collection("service");
  const eventCollection = client.db("volunteerNetwork").collection("new_event");

  
  app.get('/Events', (req, res) => {
    collection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
  })

  app.get('/searchEvent/:id', (req,res)=>{
    collection.find({_id : ObjectId(req.params.id)})
    .toArray((err, documents)=>{
        res.send(documents[0])
    })
  })


  app.get('/userEventWithEmail/:email', (req,res)=>{
    const email = req.params.email;
    console.log(email)
    eventCollection.find({email: email})
    .toArray((err, documents)=>{
            res.send(documents)
    })
})







app.delete('/deleteUserEvent/:id', (req, res) => {
  eventCollection.deleteOne({eventId:req.params.id})
  .then((result) => {
    console.log(result);
    res.send(result.deletedCount > 0)
  })
})








app.post('/addEvent' , (req,res)=>{
  const newEvent = req.body;
  eventCollection.find({email: newEvent.email, title: newEvent.title})
  .toArray((err , documents)=>{
    eventCollection.insertOne(newEvent)
          .then(result=>{
              res.send(result.insertedCount > 0)
          }) 
      })
})

});

app.get('/', (req,res) => {
  res.send("Hello, Welcome to Volunteer Server Site.")
})

app.listen(process.env.PORT || 5000)