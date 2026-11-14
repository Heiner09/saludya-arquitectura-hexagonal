import { GeneradorId } from "../../application/puertos";

// Adaptador simple del puerto GeneradorId: contador incremental.
export class GeneradorIdIncremental implements GeneradorId {
  private n = 0;

  nuevo(): string {
    this.n += 1;
    return `cita-${this.n}`;
  }
}