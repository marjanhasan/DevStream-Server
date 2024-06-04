const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.xgwyw1z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const postDB = client.db("postDB");
    const textBasedPostCollection = postDB.collection(
      "textBasedPostCollection"
    );
    const userDB = client.db("userDB");
    const userCollection = userDB.collection("userCollection");

    // ********************** posts routes
    app.post("/posts", async (req, res) => {
      const postData = req.body;
      const result = await textBasedPostCollection.insertOne(postData);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ message: "Hello from DevStream server" });
});

app.listen(port, (req, res) => {
  console.log("DevStream is listening on port: ", port);
});
