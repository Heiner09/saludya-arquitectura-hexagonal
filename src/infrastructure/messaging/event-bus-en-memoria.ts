import { EventBus } from "../../application/puertos";

// Adaptador en memoria del puerto EventBus.
// Guarda los eventos emitidos para poder verificarlos (igual que el doble de prueba).
export class EventBusEnMemoria implements EventBus {
  readonly emitidos: Array<{ nombre: string; datos: Record<string, unknown> }> = [];

  async emit(nombre: string, datos: Record<string, unknown>): Promise<void> {
    this.emitidos.push({ nombre, datos });
  }
}