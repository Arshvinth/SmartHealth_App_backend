import { MongoMemoryServer } from 'mongodb-memory-server';

async function downloadMongo() {
  const mongoServer = await MongoMemoryServer.create({
    instance: { port: 27017 },
  });
  console.log('MongoDB binaries downloaded at:', mongoServer.getUri());
  await mongoServer.stop();
}

downloadMongo().catch(err => {
  console.error(err);
  process.exit(1);
});
