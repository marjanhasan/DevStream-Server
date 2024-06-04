const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ********************* JWT Implementation
const createToken = (user) => {
  const token = jwt.sign(
    {
      email: user?.email,
    },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized access" });
  }
  const authToken = authorization.split(" ")[1];

  jwt.verify(authToken, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }
    req.user = decoded.email;
    next();
  });
};

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
    app.post("/posts", verifyToken, async (req, res) => {
      try {
        const postData = req.body;
        const result = await textBasedPostCollection.insertOne(postData);
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    app.get("/posts", verifyToken, async (req, res) => {
      try {
        const postData = textBasedPostCollection.find();
        const result = await postData.toArray();
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    app.get("/posts/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await textBasedPostCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(result || { message: "NOT FOUND" });
      } catch (error) {
        res.send(error);
      }
    });

    app.get("/profile/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        const postData = textBasedPostCollection.find({ email: email });
        const result = await postData.toArray();
        res.send(result || { message: "NOT FOUND" });
      } catch (error) {
        res.send(error);
      }
    });

    app.patch("/posts/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const postData = req.body;
        const result = await textBasedPostCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: postData }
        );
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    app.delete("/posts/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await textBasedPostCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    // ****************** user routes

    app.post("/user", async (req, res) => {
      const userData = req.body;
      const token = createToken(userData);
      const isExist = await userCollection.findOne({ email: userData.email });
      if (isExist) {
        return res.send({ message: "Login Successfull", token });
      }
      const result = await userCollection.insertOne(userData);
      res.send({ token });
    });

    app.get("/user", verifyToken, async (req, res) => {
      try {
        const userData = userCollection.find();
        const result = await userData.toArray();
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    app.get("/user/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        const result = await userCollection.findOne({ email: email });
        res.send(result || { message: "NOT FOUND" });
      } catch (error) {
        res.send(error);
      }
    });

    app.patch("/user/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        const userData = req.body;
        const result = await userCollection.updateOne(
          { email: email },
          { $set: userData },
          { upsert: true }
        );
        res.send(result);
      } catch (error) {
        res.send(error);
      }
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
