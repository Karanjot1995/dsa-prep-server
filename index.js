require('dotenv').config();

const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const mongoose = require('mongoose')
const routes = require('./routes/routes');

const PORT = 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes)

const uri = process.env.MONGO_URL;


mongoose.connect(uri);
const database = mongoose.connection


database.on('error', (error) => {
	console.log(error)
})

database.once('connected', () => {
	console.log('Database Connected');
})

app.get('/', (req,res)=>{
	res.send("hello")
})



// mongoose.connect(process.env.MONGO_URI||uri).then(() => {
//   console.log('Working!!!!')
// }).catch((error) => {
//   console.log(error)
// })
// const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run()


// const connectionString = process.env.ATLAS_URI || "mongodb+srv://admin:fiMlKVcknjt17K3M@dsa.xwiyywl.mongodb.net/?retryWrites=true&w=majority&appName=dsa";;
// const client = new MongoClient(connectionString);
// let conn;
// try {
//   conn = await client.connect();
// 	console.log('connected successfully')

// } catch(e) {
//   console.error(e);
// }
// let db = conn.db("sample_training");
// export default db;



// app.post("/compile", (req, res) => {
// 	//getting the required data from the request
// 	let code = req.body.code;
// 	let language = req.body.language;
// 	let input = req.body.input;

// 	if (language === "python") {
// 		language = "py"
// 	}

// 	let data = ({
// 		"code": code,
// 		"language": language,
// 		"input": input
// 	});
// 	let config = {
// 		method: 'post',
// 		url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		data: data
// 	};
// 	//calling the code compilation API
// 	Axios(config)
// 		.then((response) => {
// 			res.send(response.data)
// 			console.log(response.data)
// 		}).catch((error) => {
// 			console.log(error);
// 		});
// })

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
