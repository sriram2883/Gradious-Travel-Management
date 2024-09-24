const mongoose = require('mongoose');
const url = "mongodb+srv://ellurisriram27655:Sriram%402883@gradioustourmanagement.esirc.mongodb.net/GradiousTourManagement";
async function connect() {
    await mongoose.connect(url);
}
connect();
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));
db.once('close', () => console.log('Disconnected from Database'));
module.exports = mongoose;