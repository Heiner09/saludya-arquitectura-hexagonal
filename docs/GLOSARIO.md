# Glosario SaludYa

Agenda: Conjunto de citas de un médico que controla que no existan cruces entre citas activas.
Cita: Registro que relaciona un paciente con un horario determinado y posee un identificador y un estado.
RangoHorario: Intervalo entre una fecha y hora de inicio y una de finalización, donde el final debe ser posterior al inicio.
Paciente: Persona referenciada mediante pacienteId en una cita. El sistema no almacena otros datos del paciente.
Médico: Profesional referenciado mediante medicoId, al que se asocia una agenda.
Cita confirmada: Cita activa que ocupa un rango horario en la agenda.
Cita cancelada: Cita que ha sido cancelada y deja de considerarse activa.
Cruce de horario: Superposición temporal entre dos citas activas de un mismo médico.
Agendar cita: Operación que crea y registra una cita, verificando las reglas de horario.
Cancelar cita: Operación que cancela una cita existente.
