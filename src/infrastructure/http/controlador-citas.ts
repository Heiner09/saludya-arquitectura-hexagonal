import { AgendarCita } from "../../application/agendar-cita";
import { CruceDeHorarioError, RangoInvalidoError } from "../../domain/errores";

// Adaptador HTTP mínimo: valida la entrada y traduce errores del dominio a estados HTTP.
export class ControladorCitas {
  constructor(private readonly agendar: AgendarCita) {}

  async post(body: unknown): Promise<{ status: number; body?: unknown }> {
    const datos = (body ?? {}) as Record<string, unknown>;
    const { medicoId, pacienteId, inicio, fin } = datos;

    if (
      typeof medicoId !== "string" ||
      typeof pacienteId !== "string" ||
      typeof inicio !== "string" ||
      typeof fin !== "string"
    ) {
      return { status: 400, body: { error: "datos incompletos" } };
    }

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    if (Number.isNaN(fechaInicio.getTime()) || Number.isNaN(fechaFin.getTime())) {
      return { status: 400, body: { error: "fechas inválidas" } };
    }

    try {
      const id = await this.agendar.ejecutar({
        medicoId,
        pacienteId,
        inicio: fechaInicio,
        fin: fechaFin,
      });
      return { status: 201, body: { id } };
    } catch (error) {
      if (error instanceof CruceDeHorarioError) {
        return { status: 409, body: { error: error.message } };
      }
      if (error instanceof RangoInvalidoError) {
        return { status: 400, body: { error: error.message } };
      }
      throw error;
    }
  }
}