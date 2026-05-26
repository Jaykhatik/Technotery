const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
export const connectionSrt = `mongodb+srv://${username}:${password}@firstcluster.tueqd3h.mongodb.net/dataDB?appName=Firstcluster`;