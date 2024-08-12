const axios = require('axios')

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const hardcodedLaunches = [
  {
    flightNumber: 1,
    launchDate: new Date('2024-08-15'),
    mission: 'Demo-1',
    rocket: 'Falcon 9',
    target: 'LEO',
    customers: ['NASA'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 2,
    launchDate: new Date('2024-09-02'),
    mission: 'Starlink 25',
    rocket: 'Falcon 9',
    customers: ['SpaceX'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 3,
    launchDate: new Date('2024-09-10'),
    mission: 'CRS-27',
    rocket: 'Dragon 2',
    customers: ['NASA'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 4,
    launchDate: new Date('2024-09-25'),
    mission: 'GPS III-7',
    rocket: 'Falcon 9',
    customers: ['US Space Force'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 5,
    launchDate: new Date('2024-10-05'),
    mission: 'Crew-7',
    rocket: 'Dragon 2',
    customers: ['NASA'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 6,
    launchDate: new Date('2024-10-20'),
    mission: 'Starship Orbital Test',
    rocket: 'Starship',
    customers: ['SpaceX'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 7,
    launchDate: new Date('2024-11-08'),
    mission: 'Sentinel-7',
    rocket: 'Falcon 9',
    customers: ['NASA'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 8,
    launchDate: new Date('2024-11-20'),
    mission: 'Starlink 26',
    rocket: 'Falcon 9',
    customers: ['SpaceX'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 9,
    launchDate: new Date('2024-12-02'),
    mission: 'CRS-28',
    rocket: 'Dragon 2',
    customers: ['NASA'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 10,
    launchDate: new Date('2024-12-15'),
    mission: 'GPS III-8',
    rocket: 'Falcon 9',
    customers: ['US Space Force'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 11,
    launchDate: new Date('2025-01-05'),
    mission: 'Crew-8',
    rocket: 'Dragon 2',
    customers: ['NASA'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 12,
    launchDate: new Date('2025-01-20'),
    mission: 'Starlink 27',
    rocket: 'Falcon 9',
    customers: ['SpaceX'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 13,
    launchDate: new Date('2025-02-08'),
    mission: 'Sentinel-8',
    rocket: 'Falcon 9',
    customers: ['NASA'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 14,
    launchDate: new Date('2025-02-20'),
    mission: 'Starship Lunar Mission',
    rocket: 'Starship',
    customers: ['NASA'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 15,
    launchDate: new Date('2025-03-05'),
    mission: 'Starlink 28',
    rocket: 'Falcon 9',
    customers: ['SpaceX'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 16,
    launchDate: new Date('2025-03-20'),
    mission: 'CRS-29',
    rocket: 'Dragon 2',
    customers: ['NASA'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 17,
    launchDate: new Date('2025-04-08'),
    mission: 'GPS III-9',
    rocket: 'Falcon 9',
    customers: ['US Space Force'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 18,
    launchDate: new Date('2025-04-20'),
    mission: 'Starship Mars Cargo Mission',
    rocket: 'Starship',
    customers: ['SpaceX'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 19,
    launchDate: new Date('2025-05-05'),
    mission: 'Crew-9',
    rocket: 'Dragon 2',
    customers: ['NASA'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 20,
    launchDate: new Date('2025-05-20'),
    mission: 'Starlink 29',
    rocket: 'Falcon 9',
    customers: ['SpaceX'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 21,
    launchDate: new Date('2025-06-08'),
    mission: 'Sentinel-9',
    rocket: 'Falcon 9',
    customers: ['NASA'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 22,
    launchDate: new Date('2025-06-20'),
    mission: 'Starship Europa Mission',
    rocket: 'Starship',
    customers: ['ESA'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 23,
    launchDate: new Date('2025-07-05'),
    mission: 'Starlink 30',
    rocket: 'Falcon 9',
    customers: ['SpaceX'],
    upcoming: false,
    success: true,
  },
  {
    flightNumber: 24,
    launchDate: new Date('2025-07-20'),
    mission: 'CRS-30',
    rocket: 'Dragon 2',
    customers: ['NASA'],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 25,
    launchDate: new Date('2025-08-05'),
    mission: 'GPS III-10',
    rocket: 'Falcon 9',
    customers: ['US Space Force'],
    upcoming: false,
    success: true,
  },
];

async function populateLaunches() {
    console.log('Downloading launch data...');
    const response = await axios.post(SPACEX_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1
            }
          },
          {
            path: 'payloads',
            select: {
              'customers': 1
            }
          }
        ]
      }
    });
  
    if (response.status !== 200) {
      console.log('Problem downloading launch data');
      throw new Error('Launch data download failed');
    }
  
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
      const payloads = launchDoc['payloads'];
      const customers = payloads.flatMap((payload) => {
        return payload['customers'];
      });
  
      const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers,
      };
  
      console.log(`${launch.flightNumber} ${launch.mission}`);
  
      await saveLaunch(launch);
    }
  }

async function loadLaunchesData(){
    const firstLaunch = await findLaunch({
        flightNumber:1,
        rocket:'Falcon 1',
        mission:'FalconSat',
    });
    if(firstLaunch){
        console.log('Launch data already loaded');
        return;
    } else {
        await populateLaunches();
    }
}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId){
    return await findLaunch({
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

async function getAllLaunches(skip, limit){
    return await launchesDatabase
    .find({},{'_id': 0,'__v': 0,})
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
}

async function getAllLaunchesUpcoming(skip, limit){
  return await launchesDatabase
  .find({'upcoming': true},{'_id': 0,'__v': 0,})
  .sort({flightNumber: 1})
  .skip(skip)
  .limit(limit);
}

async function getAllLaunchesHistory(skip, limit){
  return await launchesDatabase
  .find({'upcoming': false},{'_id': 0,'__v': 0,})
  .sort({flightNumber: 1})
  .skip(skip)
  .limit(limit);
}

async function saveLaunch(launch){
    await launchesDatabase.findOneAndUpdate({ // e mai bine decat update pt ca trimite fix minimul de informatii necesare
        flightNumber: launch.flightNumber,    // diferenta e ca va returna fix proprietatile pe care le modificam 
    },launch,{
        upsert: true,
    })
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({keplerName: launch.target,})

    if(!planet){
        throw new Error('No matching planet was found.')
    }
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
    abortLaunchById,
    loadLaunchesData,
    getAllLaunchesUpcoming,
    getAllLaunchesHistory
}