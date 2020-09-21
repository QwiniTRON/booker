import config = require('config')
import pgPromise = require('pg-promise');


const dbPort: string = config.get('db.port')
const dbName: string = config.get('db.name')
const dbPassword: string = config.get('db.password')
const dbHost: string = config.get('db.host')
const dbDatabase: string = config.get('db.database')

const pgp = pgPromise();
const db = pgp(`postgres://${dbName}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`);

export default db