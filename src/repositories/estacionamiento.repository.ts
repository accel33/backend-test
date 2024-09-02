import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Estacionamiento} from '../models';

export class EstacionamientoRepository extends DefaultCrudRepository<
  Estacionamiento,
  typeof Estacionamiento.prototype.id
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(Estacionamiento, dataSource);
  }
}
