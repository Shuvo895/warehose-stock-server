const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.77rjn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
	try{
		await client.connect();
		const inventoryItemCollections = client.db('laptopStock').collection('inventoryItem');

		// All Inventory Item get
		app.get('/inventoryItem' ,async (req,res) => {
			const query = {};
			const cursor = inventoryItemCollections.find(query);
			const result = await cursor.toArray();
			res.send(result);
		})

		// Get the Specific Item By Id
		app.get('/inventoryItem/:inventoryId', async(req, res) => {
			const inventoryId = req.params.inventoryId;
			const query = {_id: ObjectId(inventoryId)};
			const result = await inventoryItemCollections.findOne(query);
			res.send(result);
		})

		// Update quantity for Item
		app.put('/updateQuantity/:inventoryId', async(req, res) => {
			const inventoryId = req.params.inventoryId;
			const updateQuantity = req.body;
			// res.send('done update');
			const filter = {_id: ObjectId(inventoryId)};
			const options = {upsert: true};
			const updateDoc = {
				$set: {
					quantity: updateQuantity.quantity
				},
			};
			const result = await inventoryItemCollections.updateOne(filter, updateDoc, options);
			res.send(result);
		})

		// Delete a item by id
		app.delete('/deleteInventoryItem/:inventoryId', async(req, res) => {
			const inventoryId = req.params.inventoryId;
			const query = {_id: ObjectId(inventoryId)};
			const result = await inventoryItemCollections.deleteOne(query);
			res.send(result);
		})

		// Add a item in invetory
		app.post('/addItem', async(req, res) => {
			const doc = req.body;
			const result = await inventoryItemCollections.insertOne(doc);
			res.send(result);
		})

		// My item get
		app.get('/myItem/:email', async(req, res) => {
			const email = req.params.email;
			const query = {email: email};
			const cursor = inventoryItemCollections.find(query);
			const result = await cursor.toArray();
			res.send(result);
		})
		// total out of stock
		app.get('/inventoryItemOutOfStock', async (req, res) => {
			const query = {quantity:'0'};
			const cursor = inventoryItemCollections.find(query);
			const result = await cursor.toArray();
			res.send(result);
		})
	
		//Auth
		// app.post('/login', async(req, res) => {
		// 	const user = req.body;
		// 	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
		// 		expiresIn: '2d'
		// 	})
		// 	console.log(accessToken);
		// 	res.send({accessToken});
		// })
	}
	finally{

	}
}

run().catch(console.dir);


app.get('/', (req, res) => {
	res.send('Laptop Stock Server is Running');
})

app.listen(port, () => {
	console.log('Lapto Stock is Runnnig');
})