const http = require('http');
const mongoose = require('mongoose')
const app = require('./app');

const {loadPlanetsData} = require('./models/planets.model')

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const MONGO_URL = 'mongodb+srv://flaviuspaltin599:1234@nasacluster.y81ag.mongodb.net/nasa?retryWrites=true&w=majority&appName=NASACluster';

mongoose.connection.once('open',() => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();

    server.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}...`) 
    })
}

startServer();