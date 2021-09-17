import 'dotenv/config';
import Application from './app';
import GenerateSchema from './schema';
import Database from './db';
import Authentication from './auth';
import {InitOptions} from './types'

(async () => {
  const options = {} as InitOptions;
  try { // database connection
    options.em = await (new Database()).init();
  } catch(err) { console.log('Cannot connect to database'); throw Error(err) }

  try { // database 
    options.schema = await (new GenerateSchema()).init();
  } catch(err) { console.log('Cannot build schema'); throw Error(err) };

  try { // passport authentication
    await (new Authentication()).init(options.em);
  } catch(err) { console.log('Cannot setup passport authentication'); throw Error(err) }

  try { // Initialize servers
    await (new Application()).init(options);
  } catch(err) { console.log('Cannot initialize servers'); throw Error(err) };

  (new GenerateSchema()).init()
})();