const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 9000;

const app = express();

const corsOption = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  Credential: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s3zryfx.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const jobsCollection = client.db("solosphere").collection("jobs");
    const bidsCollection = client.db("solosphere").collection("bids");

    // get the all jobs data from db
    app.get("/jobs", async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });

    // get a single job data from db using job id
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });

    // Save a bid data in db
    app.post("/bid", async (req, res) => {
      const bidData = req.body;
      console.log(bidData);
      const result = await bidsCollection.insertOne(bidData);
      res.send(result);
    });

    // Save a job data in db
    app.post("/job", async (req, res) => {
      const jobData = req.body;
      console.log(jobData);
      const result = await jobsCollection.insertOne(jobData);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from SoloSphere Server......");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
