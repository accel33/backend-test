import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param, patch, post, requestBody, response} from '@loopback/rest';
import {Estacionamiento, PagoVehiculo, TipoVehiculo} from '../models';
import {EstacionamientoRepository, VehiculoRepository} from '../repositories';
import {formatearFecha} from '../utils/formatearFecha';

type MensajePago = {
  message: string;
  salida: string;
  pago: number | string;
};

export class EstacionamientoController {
  constructor(
    @repository(EstacionamientoRepository)
    public estacionamientoRepository: EstacionamientoRepository,
    @repository(VehiculoRepository)
    public vehiculoRepository: VehiculoRepository,
  ) {}

  @post('/estacionamiento/entrada')
  @response(200, {
    description: 'Crear una nueva estancia',
    content: {'application/json': {schema: getModelSchemaRef(Estacionamiento)}},
  })
  async registrarEntrada(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              vehiculoPlaca: {type: 'string'},
            },
            required: ['vehiculoPlaca'],
          },
        },
      },
    })
    request: {
      vehiculoPlaca: string;
    },
  ): Promise<Estacionamiento> {
    // Validar si el Vehiculo ya se encuentra registrado
    const registroExistente = await this.estacionamientoRepository.findOne({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: {vehiculoPlaca: request.vehiculoPlaca, horaSalida: null as any},
    });

    if (registroExistente && !registroExistente.horaSalida) {
      throw new HttpErrors.Conflict('El vehiculo ya se encuentra estacionado');
    }

    // Buscar Vehiculo, si no existe, crearlo
    let vehiculo = await this.vehiculoRepository.findOne({where: {placa: request.vehiculoPlaca}});
    if (!vehiculo) {
      vehiculo = await this.vehiculoRepository.create({
        placa: request.vehiculoPlaca,
      });
    }

    // Crear estancia
    const estancia = await this.estacionamientoRepository.create({vehiculoPlaca: vehiculo.placa});

    return estancia;
  }

  @patch('/estacionamiento/salida/{placa}')
  @response(204, {
    description: 'Estacionamiento saliendo',
  })
  async registrarSalida(@param.path.string('placa') placa: string): Promise<MensajePago> {
    const registroExistente = await this.estacionamientoRepository.findOne({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: {vehiculoPlaca: placa},
      order: ['horaEntrada DESC'],
    });
    if (!registroExistente) {
      throw new HttpErrors.NotFound('El vehiculo no se encuentra estacionado');
    }
    if (registroExistente.horaSalida) {
      throw new HttpErrors.Conflict('El vehiculo ya salio del estacionamiento');
    }

    // Agregar la hora de salida y la duracion
    registroExistente.horaSalida = new Date().toISOString();
    const duracion =
      new Date(registroExistente.horaSalida).getTime() - new Date(registroExistente.horaEntrada).getTime();
    registroExistente.duracionEnMinutos = duracion / 60000;

    // Actualizar y calcular los pagos
    await this.estacionamientoRepository.updateById(registroExistente.id, registroExistente);
    const vehiculo = await this.vehiculoRepository.findById(registroExistente.vehiculoPlaca);

    if (vehiculo.tipoVehiculo === TipoVehiculo.OFICIAL) {
      return {
        message: 'Salida de vehiculo Oficial registrada',
        salida: formatearFecha(registroExistente.horaSalida),
        pago: 'Gratis',
      };
    }

    if (vehiculo.tipoVehiculo === TipoVehiculo.RESIDENTE) {
      // Actualizamos los minutos del Vehiculo
      await this.vehiculoRepository.updateById(registroExistente.vehiculoPlaca, {
        minutosAcumulados: vehiculo.minutosAcumulados + registroExistente.duracionEnMinutos,
      });

      return {
        message: 'Salida de vehiculo Residente registrada',
        salida: formatearFecha(registroExistente.horaSalida),
        pago: 'Se cobra a fin de mes',
      };
    }

    // Calcular duracion en minutos
    const montoPagar = (duracion / 60000) * PagoVehiculo.NO_RESIDENTE;

    return {
      message: 'Salida de vehiculo No Residente registrada',
      salida: formatearFecha(registroExistente.horaSalida),
      pago: `S/. ${montoPagar.toFixed(2)}`,
    };
  }

  @get('/estacionamiento/registros')
  @response(200, {
    description: 'Array of Estacionamiento model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Estacionamiento, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Estacionamiento[]> {
    return this.estacionamientoRepository.find();
  }
}
