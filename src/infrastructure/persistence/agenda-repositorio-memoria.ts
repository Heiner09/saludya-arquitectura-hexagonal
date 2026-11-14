import { Agenda } from "../../domain/agenda";
import { AgendaRepositorio } from "../../domain/agenda-repositorio";
import { Cita } from "../../domain/cita";

// Adaptador en memoria del puerto AgendaRepositorio.
// Clona al leer y al guardar para no compartir referencias con el llamador.
export class AgendaRepositorioMemoria implements AgendaRepositorio {
  private readonly datos = new Map<string, Agenda>();

  async porMedico(medicoId: string): Promise<Agenda> {
    const guardada = this.datos.get(medicoId);
    if (!guardada) {
      return new Agenda(medicoId);
    }
    return new Agenda(
      guardada.medicoId,
      guardada.citas().map((c) =>
        Cita.reconstruir(c.id, c.pacienteId, c.rango, c.estado),
      ),
    );
  }

  async guardar(agenda: Agenda): Promise<void> {
    const copia = new Agenda(
      agenda.medicoId,
      agenda.citas().map((c) =>
        Cita.reconstruir(c.id, c.pacienteId, c.rango, c.estado),
      ),
    );
    this.datos.set(agenda.medicoId, copia);
  }
}