import { readFile, writeFile } from "fs/promises";

let db = {};

let dbLoaded = false;

async function loadDb() {
  console.log("loading...");
  try {
    const raw = await readFile("db.json", "utf8");
    db = JSON.parse(raw);
    dbLoaded = true;
  } catch (error) {
    if (error.code === "ENOENT") {
      // Set flag to true to allow writing.
      dbLoaded = true;
      await saveDb();
    } else {
      console.error("Error opening db JSON file: ", error);
    }
  }
}

async function saveDb() {
  if (!dbLoaded) {
    console.error("Attempted to save before loading existing data.");
    return;
  }
  await writeFile("db.json", JSON.stringify(db), "utf8");
}

// Simply adds data to the root of the db object.
async function addData(key, value) {
  if (!dbLoaded) {
    console.error(
      "Attempted to add data before loading existing data from db."
    );
    return;
  }
  if (db[key]) return false;
  else db[key] = value;
  await saveDb();
}

const getData = (key) => {
  return db[key];
};

export { loadDb, getData, addData };
