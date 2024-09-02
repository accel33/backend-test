import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env file

console.log(process.env.MONGO_URI);
const config = {
  name: 'mongodb',
  connector: 'mongodb',
  url: process.env.MONGO_URI || 'mongodb://root:dev@mongo:27017/?authSource=admin',
  // url: process.env.MONGO_URI || 'mongodb://mongodb:27017/node-boilerplate',
  // url: 'mongodb+srv://accel:12345@cluster0.kzwanpq.mongodb.net/testdb?retryWrites=true&w=majority',
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'mongodb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
