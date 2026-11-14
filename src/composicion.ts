import { AgendaRepositorio } from "./domain/agenda-repositorio";
import { AgendarCita } from "./application/agendar-cita";
import { AgendaRepositorioMemoria } from "./infrastructure/persistence/agenda-repositorio-memoria";
import { AgendaRepositorioJson } from "./infrastructure/persistence/agenda-repositorio-json";
import { EventBusEnMemoria } from "./infrastructure/messaging/event-bus-en-memoria";
import { GeneradorIdIncremental } from "./infrastructure/id/generador-id-incremental";
import { ControladorCitas } from "./infrastructure/http/controlador-citas";

export type Persistencia =
  | { tipo: "memoria" }
  | { tipo: "json"; ruta: string };

export interface App {
  controller: ControladorCitas;
  agendas: AgendaRepositorio;
  eventos: EventBusEnMemoria;
}

// Único lugar donde se decide qué adaptador concreto se usa.
export function crearApp(persistencia: Persistencia): App {
  const agendas: AgendaRepositorio =
    persistencia.tipo === "memoria"
      ? new AgendaRepositorioMemoria()
      : new AgendaRepositorioJson(persistencia.ruta);

  const eventos = new EventBusEnMemoria();
  const ids = new GeneradorIdIncremental();
  const agendar = new AgendarCita(agendas, eventos, ids);
  const controller = new ControladorCitas(agendar);

  return { controller, agendas, eventos };
}