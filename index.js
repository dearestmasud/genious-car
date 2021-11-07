const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oan01.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        /* POST API from UI given by client */
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = servicesCollection.insertOne(service);
            res.json(result);
        })

        /* GET API from database*/
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        /* GET API for single collection */
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        /* DELETE API  */
        app.delete('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally { }
}
main().catch(console.dir);
app.get('/', (req, res) => {
    res.send('server init');
});

app.get('/hello',(req,res)=>{
    res.send('hello here')
})
app.listen(port, () => {
    console.log('server running on', port);
})