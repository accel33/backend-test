import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Vehiculo} from './vehiculo.model';

@model()
export class Estacionamiento extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Vehiculo, {name: 'placa'})
  vehiculoPlaca: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  horaEntrada: string;

  @property({
    type: 'date',
    nullable: true,
  })
  horaSalida?: string | null;

  @property({
    type: 'number',
  })
  duracionEnMinutos?: number;

  constructor(data?: Partial<Estacionamiento>) {
    super(data);
  }
}

export interface EstacionamientoRelations {
  // describe navigational properties here
}

export type EstacionamientoWithRelations = Estacionamiento & EstacionamientoRelations;
