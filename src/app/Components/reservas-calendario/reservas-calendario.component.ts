import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // Importar el módulo de FullCalendar
import { CalendarOptions, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; 
import { ReservasService } from '../../Services/reservas.service';
import { CanchaInterface } from '../../Interface/CanchaInterface';
import { ReservaInterface } from '../../Interface/ReservaInterface';

@Component({
    selector: 'app-reservas-calendario',
    imports: [FullCalendarModule],
    templateUrl: './reservas-calendario.component.html',
    styleUrl: './reservas-calendario.component.css'
})
export class ReservasCalendarioComponent implements OnInit{

  constructor(private reservaService: ReservasService) {}
  ngOnInit(): void {
    this.cargarReservas();
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek', // Vista semanal con franjas horarias
    locale: esLocale, // <-- Aquí se configura el idioma en español
    timeZone:"local",
    slotMinTime: "06:00:00", // Hora de inicio del día
    slotMaxTime: "24:00:00", // Hora de finalización del día
    allDaySlot: false, // No permitir eventos de todo el día
    editable:true,
    eventDrop:this.actualizarReserva.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: []
  };

  canchasDisponibles: CanchaInterface[] = [];

  cargarReservas() {
  
    this.reservaService.getReservas().subscribe(reservas => {
      //console.log("Reservas recibidas:", reservas);
      this.canchasDisponibles = this.obtenerCanchas(reservas);
      this.calendarOptions.events = this.procesarEventos(reservas);
    });
  }

  obtenerCanchas(reservas: any[]) {
    return Array.from(new Set(reservas.map(r => r.cancha.id)))
      .map(id => reservas.find(r => r.cancha.id === id)?.cancha);
  }

  procesarEventos(reservas: any[]) {
    return reservas.map(r => {
      const fechaISO = this.convertirFechaISO(r.fecha);
      const abreviacionTipo = r.tipo === 'ALQUILER' ? 'ALQ' : r.tipo === 'CLASE' ? 'CLA' : 'GEN';
      const abreviacionCancha = r.cancha?.nombre.replace('Cancha ', 'C') || 'SC'; // Si no hay cancha, poner 'SC' (Sin Cancha)


      return {
        id: r.id,
        title: `${abreviacionTipo}-${abreviacionCancha}`,
        start: `${fechaISO}T${r.inicio}`, // Asegurar formato correcto
        end: `${fechaISO}T${r.finalizacion}`, // Asegurar formato correcto
        color: this.obtenerColorPorCancha(r.cancha?.id), 
        extendedProps: {
          cancha: r.cancha,
          nombre: r.nombre || 'Sin Nombre', // Evitar 'null'
          tipo: r.tipo || 'General' // Asegurar que no sea undefined
        }
      };
    });
  }


  actualizarReserva(evento: EventDropArg) {

    const fechaInicio = evento.event.start!;
    const fechaFin = evento.event.end!;

    const reservaActualizada: ReservaInterface = {
      id: Number(evento.event.id),
      nombre:evento.event.extendedProps["nombre"],
      fecha: this.convertirFechaAFormatoBackend(evento.event.start!),
      inicio: fechaInicio.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }), // Hora en formato local
      finalizacion: fechaFin?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }) || '',
      cancha: evento.event.extendedProps['cancha'], // Acceder directamente al objeto `cancha`
      tipo: evento.event.extendedProps['tipo'] || "RESERVA"
    };
  
    //console.log('Nueva reserva:', reservaActualizada);
  
    this.reservaService.updateReserva(reservaActualizada.id!, reservaActualizada).subscribe({
      next: () => {
        alert('Reserva actualizada con éxito');
      },
      error: (err) => {
        console.error('Error al actualizar reserva:', err);
      },
    });
  }

  convertirFechaAFormatoBackend(fecha: Date): string {
    const fechaISO = fecha.toISOString().split('T')[0]; // '2025-03-26'
    const partes = fechaISO.split('-'); // ["2025", "03", "26"]
    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Retorna '26-03-2025'
  }

  convertirFechaISO(fecha: string): string {
    const partes = fecha.split('-'); // Divide "26-03-2025" en ["26", "03", "2025"]
    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Retorna "2025-03-26"
  }

  obtenerColorPorCancha(canchaId: number): string {
    const colores = ["#97ab84", "#849dab","#97ab84", "#849dab"]; // Colores asignados a canchas
    return colores[canchaId % colores.length]; // Asignar un color diferente a cada cancha
  }


}

