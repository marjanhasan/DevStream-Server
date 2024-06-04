const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    app.get("/posts", async (req, res) => {
      const postData = textBasedPostCollection.find();
      const result = await postData.toArray();
      res.send(result);
    });

    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await textBasedPostCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const postData = textBasedPostCollection.find({ email: email });
      const result = await postData.toArray();
      res.send(result);
    });

    app.patch("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const postData = req.body;
      const result = await textBasedPostCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: postData }
      );
      res.send(result);
    });

    app.delete("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await textBasedPostCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // ****************** user routes

    app.post("/user", async (req, res) => {
      const userData = req.body;
      const isExist = await userCollection.findOne({ email: userData.email });
      if (isExist) {
        return res.send({ message: "Login Successfull" });
      }
      const result = await userCollection.insertOne(userData);
      res.send(result);
    });

    app.get("/user", async (req, res) => {
      const userData = userCollection.find();
      const result = await userData.toArray();
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email: email });
      res.send(result || { message: "NO USER FOUND" });
    });

    app.patch("/user/:email", async (req, res) => {
      const email = req.params.email;
      const userData = req.body;
      const result = await userCollection.updateOne(
        { email: email },
        { $set: userData },
        { upsert: true }
      );
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
