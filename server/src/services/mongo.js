const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://flaviuspaltin599:1234@nasacluster.y81ag.mongodb.net/nasa?retryWrites=true&w=majority&appName=NASACluster';

mongoose.connection.once('open',() => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}
module.exports = {
    mongoConnect,
    mongoDisconnect,
}