# Reto Tecnico Kambista (Bitacora)

![Kambista](/Kambista.png)
Se requiere hacer un servidor con las funcionalidades para contabilizar las horas o en este caso minutos, de los vehiculos cuando ingresan al estacionamiento.

Se ha decidido hacer los nombramientos (variables, entidades, metodos, rutas) en español para facilitar el entendimiento del programa para futuros desarrolladores.

Las tecnologias a utilizar son las que utilizan en Kambista:

- Loopback4
- Typescript
- MongoDB
- Docker

## Proyecto

Modelos:

![Modelos](/Modelos.png)

Metodos:

![Modelos](/Metodos.png)

Se tomo en consideracion hacer un Modelo adicional que sea Tipo Vehiculo, pero dado que solo tiene datos fijos que no requieren de manera regular, se decidio por un Enum `Tipo Vehiculo`

## Limitaciones

Por cuestiones de tiempo y falta de conocimiento sobre el funcionamiento interno de Loopback 4, no se va a poder generar ObjectIDs y createdAt a las entidades como suelo hacer al trabajar con NestJS.

Tampoco se van a crear DTOs basado en las convenciones que se han podido observar en Loopback 4. En el tutorial y los ejemplos mas avanzados con los que cuentan en su documentacion, no se ha encontrado el uso de DTOs.

---

No puedo manejar los errores aun con Loopback 4. La documentacion sobre Middleware es para Loopback 3, no hay claridad sobre como hacer que funcione. Si la placa ya esta registrada en el endpoint `/estacionamientos/entrada`

![ErrorEntrada](/ErrorEntrada.png)

La unica manera de verlo por ahora es en el log que vota el Throws dentro del terminal de ejecucion.

![ErrorEntradaTerminal](/ErrorEntradaTerminal.png)

---

He tenido inconveniente con utilizar el metodo de repository .findById(). Se sale antes de tiempo con error `Error: Entity not found: Vehiculo with id "ABC334"`. (No llega al If) Hay que utilizar .findOne()

![FindById](/FindById.png)

---
