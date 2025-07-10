const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = require ("./atlas_uri")

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const dbname="ProRigsRentals"
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db(dbname).command({ ping: 1 });
    console.log(`Pinged your deployment. You successfully connected to the ${dbname} database`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

