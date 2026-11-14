import { Cita } from "./cita";
import { CruceDeHorarioError, CitaNoEncontradaError } from "./errores";

// Agregado: raíz que protege las invariantes del conjunto de citas de un médico.
export class Agenda {
  readonly medicoId: string;
  private readonly citasInternas: Cita[];

  constructor(medicoId: string, citas: Cita[] = []) {
    this.medicoId = medicoId;
    this.citasInternas = [...citas];
  }

  agendar(cita: Cita): void {
    const hayCruce = this.citasInternas.some(
      (c) => c.activa() && c.rango.seCruzaCon(cita.rango),
    );
    if (hayCruce) {
      throw new CruceDeHorarioError();
    }
    this.citasInternas.push(cita);
  }

  cancelar(id: string): void {
    const cita = this.citasInternas.find((c) => c.id === id);
    if (!cita) {
      throw new CitaNoEncontradaError();
    }
    cita.cancelar();
  }

  // Devolvemos copia para que nadie modifique la lista interna desde fuera.
  citas(): Cita[] {
    return [...this.citasInternas];
  }
}