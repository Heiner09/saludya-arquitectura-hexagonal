import { RangoInvalidoError } from "./errores";

// Objeto de valor: se define por sus atributos (inicio y fin), no por identidad.
// Es inmutable: clonamos las fechas para que nadie pueda alterarlo desde fuera.
export class RangoHorario {
  private constructor(
    readonly inicio: Date,
    readonly fin: Date,
  ) {}

  static crear(inicio: Date, fin: Date): RangoHorario {
    const i = new Date(inicio.getTime());
    const f = new Date(fin.getTime());
    if (!(f.getTime() > i.getTime())) {
      throw new RangoInvalidoError();
    }
    return new RangoHorario(i, f);
  }

  duracionMinutos(): number {
    return (this.fin.getTime() - this.inicio.getTime()) / 60_000;
  }

  seCruzaCon(otro: RangoHorario): boolean {
    // Dos rangos comparten algún minuto si uno empieza antes de que el otro termine
    // y el otro empieza antes de que este termine. El caso "tocar en el borde" no cuenta.
    return this.inicio.getTime() < otro.fin.getTime() && otro.inicio.getTime() < this.fin.getTime();
  }

  igualA(otro: RangoHorario): boolean {
    return this.inicio.getTime() === otro.inicio.getTime() && this.fin.getTime() === otro.fin.getTime();
  }
}