import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Vehiculo} from '../models';

export class VehiculoRepository extends DefaultCrudRepository<Vehiculo, typeof Vehiculo.prototype.placa> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(Vehiculo, dataSource);
  }
}
