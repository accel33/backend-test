import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param, patch, post, requestBody, response} from '@loopback/rest';
import {TipoVehiculo, Vehiculo} from '../models';
import {EstacionamientoRepository, VehiculoRepository} from '../repositories';

export class VehiculoController {
  constructor(
    @repository(VehiculoRepository)
    public vehiculoRepository: VehiculoRepository,

    @repository(EstacionamientoRepository)
    public estacionamientoRepository: EstacionamientoRepository,
  ) {}

  @post('/vehiculos')
  @response(200, {
    description: 'Vehiculo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vehiculo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculo, {
            title: 'NewVehiculo',
            exclude: ['minutosAcumulados', 'tipoVehiculo'], // exclude minutosAcumulados from the schema
          }),
        },
      },
    })
    vehiculo: Vehiculo,
  ): Promise<Vehiculo> {
    const vehiculoEncontrado = await this.vehiculoRepository.findOne({where: {placa: vehiculo.placa}});
    if (vehiculoEncontrado) {
      throw new HttpErrors.Conflict(`El vehiculo con placa ${vehiculo.placa} ya existe`);
    }
    return this.vehiculoRepository.create(vehiculo);
  }

  @get('/vehiculos')
  @response(200, {
    description: 'Array of Vehiculo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vehiculo, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Vehiculo[]> {
    const result = await this.vehiculoRepository.find();
    return result;
  }

  @patch('/vehiculos/dar-de-alta-oficial/{placa}')
  @response(204, {
    description: 'Vehiculo cambia su tipo a oficial',
  })
  async darDeAltaOficial(@param.path.string('placa') placa: string): Promise<{message: string}> {
    const vehiculoEncontrado = await this.vehiculoRepository.findOne({where: {placa: placa}});
    if (!vehiculoEncontrado) {
      throw new HttpErrors.NotFound(`No se encontro el vehiculo con placa ${placa}`);
    }
    if (vehiculoEncontrado.tipoVehiculo === TipoVehiculo.OFICIAL) {
      return {message: 'Ningun cambio realizado. El Vehiculo ya era Oficial'};
    }
    vehiculoEncontrado.tipoVehiculo = TipoVehiculo.OFICIAL;
    await this.vehiculoRepository.updateById(vehiculoEncontrado.placa as string, vehiculoEncontrado);
    return {message: 'Vehiculo cambiado a Oficial correctamente'};
  }

  @patch('/vehiculos/dar-de-alta-residente/{placa}')
  @response(204, {
    description: 'Vehiculo cambia su tipo a residente',
  })
  async darDeAltaResidente(
    @param.path.string('placa') placa: string,
    // el requestbody solo recibe le placa del vehiculo
  ): Promise<{message: string}> {
    const vehiculoEncontrado = await this.vehiculoRepository.findOne({where: {placa: placa}});
    if (!vehiculoEncontrado) {
      throw new HttpErrors.NotFound(`No se encontro el vehiculo con placa ${placa}`);
    }
    if (vehiculoEncontrado.tipoVehiculo === TipoVehiculo.RESIDENTE) {
      return {message: 'Ningun cambio realizado. El Vehiculo ya era Residente'};
    }
    vehiculoEncontrado.tipoVehiculo = TipoVehiculo.RESIDENTE;
    await this.vehiculoRepository.updateById(vehiculoEncontrado.placa as string, vehiculoEncontrado);
    return {message: 'Vehiculo cambiado a Residente correctamente'};
  }
}
