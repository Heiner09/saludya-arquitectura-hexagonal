import { AgendaRepositorio } from "../domain/agenda-repositorio";
import { EventBus } from "./puertos";

export interface CancelarCitaCmd {
  medicoId: string;
  citaId: string;
}

export class CancelarCita {
  constructor(
    private readonly agendas: AgendaRepositorio,
    private readonly eventos: EventBus,
  ) {}

  async ejecutar(cmd: CancelarCitaCmd): Promise<void> {
    const agenda = await this.agendas.porMedico(cmd.medicoId);

    // El agregado lanza CitaNoEncontradaError si la cita no existe.
    agenda.cancelar(cmd.citaId);

    await this.agendas.guardar(agenda);

    await this.eventos.emit("cita.cancelada", {
      citaId: cmd.citaId,
      medicoId: cmd.medicoId,
    });
  }
}