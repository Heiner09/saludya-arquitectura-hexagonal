// Errores del negocio. Viven en el dominio porque expresan reglas del negocio,
// no detalles técnicos (HTTP, base de datos, etc.).
export class RangoInvalidoError extends Error {
  constructor() {
    super("El rango horario es inválido: el fin debe ser posterior al inicio");
    this.name = "RangoInvalidoError";
  }
}

export class CitaYaCanceladaError extends Error {
  constructor() {
    super("La cita ya estaba cancelada");
    this.name = "CitaYaCanceladaError";
  }
}

export class CitaNoEncontradaError extends Error {
  constructor() {
    super("No se encontró la cita indicada");
    this.name = "CitaNoEncontradaError";
  }
}

export class CruceDeHorarioError extends Error {
  constructor() {
    super("El horario se cruza con otra cita activa");
    this.name = "CruceDeHorarioError";
  }
}