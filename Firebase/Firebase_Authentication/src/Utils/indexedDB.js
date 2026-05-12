import { openDB } from "idb";

const DB_NAME = "JHubUploadsDB";
const STORE_NAME = "uploads";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      // Create uploads store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

// Save file
export const saveFile = async (file) => {
  const db = await initDB();

  const fileData = {
    name: file.name,
    type: file.type,
    size: file.size,
    file: file,
    createdAt: new Date(),
  };

  return db.add(STORE_NAME, fileData);
};

// Get all files
export const getFiles = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Delete file
export const deleteFile = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};