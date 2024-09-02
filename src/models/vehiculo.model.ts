import {Entity, model, property} from '@loopback/repository';

export enum TipoVehiculo {
  OFICIAL = 1,
  RESIDENTE = 2,
  NO_RESIDENTE = 3,
}

export enum PagoVehiculo {
  OFICIAL = 0,
  RESIDENTE = 0.05,
  NO_RESIDENTE = 0.5,
}

@model()
export class Vehiculo extends Entity {
  // @property({
  //   type: 'string',
  //   id: true,
  //   generated: true,
  //   // jsonSchema: {
  //   //   hidden: true, // Exclude `id` from OpenAPI schema
  //   // },
  // })
  // id?: string;

  @property({
    type: 'string',
    id: true,
    index: {
      unique: true,
    },
  })
  placa: string;

  @property({
    type: 'number',
    jsonSchema: {
      type: 'integer',
    },
    default: TipoVehiculo.NO_RESIDENTE,
  })
  tipoVehiculo: TipoVehiculo;

  @property({
    type: 'number',
    default: 0,
  })
  minutosAcumulados: number;

  // @property({
  //   type: 'date',
  //   default: () => new Date(),
  // })
  // createdAt?: string;

  constructor(data?: Partial<Vehiculo>) {
    super(data);
  }
}

export interface VehiculoRelations {
  // describe navigational properties here
}

export type VehiculoWithRelations = Vehiculo & VehiculoRelations;
