import { RangoHorario } from "./rango-horario";
import { CitaYaCanceladaError } from "./errores";

export type EstadoCita = "confirmada" | "cancelada";

// Entidad: tiene identidad (id). Su estado cambia, pero la identidad se conserva.
export class Cita {
  private estadoInterno: EstadoCita;

  private constructor(
    readonly id: string,
    readonly pacienteId: string,
    readonly rango: RangoHorario,
    estado: EstadoCita,
  ) {
    this.estadoInterno = estado;
  }

  static nueva(id: string, pacienteId: string, rango: RangoHorario): Cita {
    return new Cita(id, pacienteId, rango, "confirmada");
  }

  // Usada por adaptadores para recrear una cita desde persistencia sin alterar su estado.
  static reconstruir(
    id: string,
    pacienteId: string,
    rango: RangoHorario,
    estado: EstadoCita,
  ): Cita {
    return new Cita(id, pacienteId, rango, estado);
  }

  get estado(): EstadoCita {
    return this.estadoInterno;
  }

  activa(): boolean {
    return this.estadoInterno === "confirmada";
  }

  cancelar(): void {
    if (this.estadoInterno === "cancelada") {
      throw new CitaYaCanceladaError();
    }
    this.estadoInterno = "cancelada";
  }
}