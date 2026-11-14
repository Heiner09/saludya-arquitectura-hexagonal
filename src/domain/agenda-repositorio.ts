import { Agenda } from "./agenda";

// Puerto: contrato que el dominio necesita del exterior para persistir agendas.
// La interfaz vive en el dominio; la implementación (adaptador) vive en infraestructura.
export interface AgendaRepositorio {
  porMedico(medicoId: string): Promise<Agenda>;
  guardar(agenda: Agenda): Promise<void>;
}