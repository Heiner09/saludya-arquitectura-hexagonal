import { readFile, writeFile } from "node:fs/promises";
import { Agenda } from "../../domain/agenda";
import { AgendaRepositorio } from "../../domain/agenda-repositorio";
import { Cita } from "../../domain/cita";
import { RangoHorario } from "../../domain/rango-horario";

interface CitaJson {
  id: string;
  pacienteId: string;
  inicio: string;
  fin: string;
  estado: "confirmada" | "cancelada";
}

interface AgendaJson {
  medicoId: string;
  citas: CitaJson[];
}

// Adaptador que persiste agendas en un archivo JSON.
// Clona al leer y al guardar para no compartir referencias con el llamador.
export class AgendaRepositorioJson implements AgendaRepositorio {
  constructor(private readonly ruta: string) {}

  private async leerTodas(): Promise<AgendaJson[]> {
    try {
      const texto = await readFile(this.ruta, "utf-8");
      if (!texto.trim()) return [];
      return JSON.parse(texto) as AgendaJson[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  private async escribirTodas(agendas: AgendaJson[]): Promise<void> {
    await writeFile(this.ruta, JSON.stringify(agendas, null, 2), "utf-8");
  }

  private reconstruir(ag: AgendaJson): Agenda {
    return new Agenda(
      ag.medicoId,
      ag.citas.map((c) =>
        Cita.reconstruir(
          c.id,
          c.pacienteId,
          RangoHorario.crear(new Date(c.inicio), new Date(c.fin)),
          c.estado,
        ),
      ),
    );
  }

  async porMedico(medicoId: string): Promise<Agenda> {
    const todas = await this.leerTodas();
    const encontrada = todas.find((a) => a.medicoId === medicoId);
    if (!encontrada) {
      return new Agenda(medicoId);
    }
    return this.reconstruir(encontrada);
  }

  async guardar(agenda: Agenda): Promise<void> {
    const todas = await this.leerTodas();
    const serializada: AgendaJson = {
      medicoId: agenda.medicoId,
      citas: agenda.citas().map((c) => ({
        id: c.id,
        pacienteId: c.pacienteId,
        inicio: c.rango.inicio.toISOString(),
        fin: c.rango.fin.toISOString(),
        estado: c.estado,
      })),
    };
    const indice = todas.findIndex((a) => a.medicoId === agenda.medicoId);
    if (indice >= 0) {
      todas[indice] = serializada;
    } else {
      todas.push(serializada);
    }
    await this.escribirTodas(todas);
  }
}