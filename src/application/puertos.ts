// Puertos (interfaces) que los casos de uso necesitan del exterior.
// Viven en application porque son contratos del núcleo, no implementaciones.
export interface EventBus {
  emit(nombre: string, datos: Record<string, unknown>): Promise<void>;
}

export interface GeneradorId {
  nuevo(): string;
}