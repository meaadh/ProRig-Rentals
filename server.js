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
let db;

async function connectToDB() {
  if(!db)
    { 
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Confirmation of a successful connection
      db= client.db(dbname);
      console.log(` Successfully connected to the ${dbname} database`);
    } catch(err) {
      // Error message when client fails to connection
      console.log(` MongoDB connection failed to the ${dbname} database`,err);
    }
  }
  return db;
}
module.exports=connectToDB;
