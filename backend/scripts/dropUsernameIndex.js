require("dotenv").config();
const mongoose = require("mongoose");

async function dropUsernameIndex() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const users = mongoose.connection.collection("users");
  const indexes = await users.indexes();
  const usernameIndex = indexes.find((index) => index.key?.username === 1);

  if (usernameIndex) {
    await users.dropIndex(usernameIndex.name);
    console.log("Dropped legacy username_1 index.");
  } else {
    console.log("No username_1 index found; nothing to migrate.");
  }

  const result = await users.updateMany(
    { username: { $exists: true } },
    { $unset: { username: "" } },
  );
  console.log(`Removed username from ${result.modifiedCount} user record(s).`);
}

dropUsernameIndex()
  .catch((error) => {
    console.error("Could not remove the legacy username index:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
