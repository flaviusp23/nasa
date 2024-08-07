const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
}

saveLaunch(launch)

async function existsLaunchWithId(launchId){
    return await launchesDatabase.findOne({
        flightNumber: launchId,
    })
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
    .findOne({})
    .sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getAllLaunches(){
    return await launchesDatabase.find({},{
        '_id': 0,
        '__v': 0,
    });
}

async function saveLaunch(launch){
    const planet = await planets.findOne({keplerName: launch.target,})

    if(!planet){
        throw new Error('No matching planet was found.')
    }

    await launchesDatabase.findOneAndUpdate({ // e mai bine decat update pt ca trimite fix minimul de informatii necesare
        flightNumber: launch.flightNumber,    // diferenta e ca va returna fix proprietatile pe care le modificam 
    },launch,{
        upsert: true,
    })
}

async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        succes: true,
        upcoming: true,
        customers:['Google','NASA'],
        flightNumber: newFlightNumber,
    })

    await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId){
    //delete is not usefull in modern era. better to keep it and just update.
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    },{
        upcoming: false,
        succes: false,
    });
    return aborted.modifiedCount === 1;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
}