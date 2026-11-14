import { AgendaRepositorio } from "../domain/agenda-repositorio";
import { Cita } from "../domain/cita";
import { RangoHorario } from "../domain/rango-horario";
import { RangoInvalidoError, CruceDeHorarioError } from "../domain/errores";
import { EventBus, GeneradorId } from "./puertos";

export interface AgendarCitaCmd {
  medicoId: string;
  pacienteId: string;
  inicio: Date;
  fin: Date;
}

// Caso de uso: orquesta el flujo de agendar una cita sin contener reglas de negocio.
export class AgendarCita {
  constructor(
    private readonly agendas: AgendaRepositorio,
    private readonly eventos: EventBus,
    private readonly ids: GeneradorId,
  ) {}

  async ejecutar(cmd: AgendarCitaCmd): Promise<string> {
    // 1. Valida el rango antes de tocar persistencia ni eventos.
    const rango = RangoHorario.crear(cmd.inicio, cmd.fin);

    // 2. Carga la agenda del médico (puerto).
    const agenda = await this.agendas.porMedico(cmd.medicoId);

    // 3. Genera id y crea la cita (el dominio protege la identidad/estado).
    const id = this.ids.nuevo();
    const cita = Cita.nueva(id, cmd.pacienteId, rango);

    // 4. El agregado decide si hay cruce (puede lanzar CruceDeHorarioError).
    agenda.agendar(cita);

    // 5. Persiste (puerto).
    await this.agendas.guardar(agenda);

    // 6. Notifica solo si todo salió bien.
    await this.eventos.emit("cita.confirmada", {
      citaId: id,
      medicoId: cmd.medicoId,
    });

    return id;
  }
}