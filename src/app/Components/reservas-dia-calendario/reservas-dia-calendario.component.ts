import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core'
import { ReservasService } from '../../Services/reservas.service';

;
import { FullCalendarModule } from '@fullcalendar/angular'; // Importar el módulo de FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import esLocale from '@fullcalendar/core/locales/es'; 
import { CanchaInterface } from '../../Interface/CanchaInterface';
import { ReservaInterface } from '../../Interface/ReservaInterface';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditReservaModalComponent } from '../Reservas/edit-reserva-modal/edit-reserva-modal.component';
import { AlumnoInterface } from '../../Interface/AlumnoInterface';
import { ProfesorInterface } from '../../Interface/ProfesorInterface';
import { ClaseInterface } from '../../Interface/Claseinterface';
import { AlqInterface } from '../../Interface/AlqInterface';



@Component({
    selector: 'app-reservas-dia-calendario',
    imports: [FullCalendarModule, MatButtonModule, MatIconModule],
    templateUrl: './reservas-dia-calendario.component.html',
    styleUrl: './reservas-dia-calendario.component.css'
})
export class ReservasDiaCalendarioComponent implements OnInit{
  
  ngOnInit(): void {
   this.cargarReservas();
  }
  
  @Output() actualizarAlumnos = new EventEmitter<void>(); 
  
  private service = inject(ReservasService);
  private dialog=inject(MatDialog);

  alumnos:AlumnoInterface[] = []; 
  profesores:ProfesorInterface[]=[];
  reservaSeleccionada!: ReservaInterface;
  alqSeleccionado!:AlqInterface;
  claseSeleccionada!:ClaseInterface;

  calendarOptions: CalendarOptions = {

    plugins:[dayGridPlugin, timeGridPlugin, interactionPlugin],
    /*datesSet: (info) => {
      let tituloElemento = document.querySelector('.calendario-dia .fc-toolbar-title');
      if (tituloElemento) {
        console.log(info.view.title);
        tituloElemento.textContent = `📅 Reservas por dia ${info.view.title}`;
      }
    },*/
    initialView: 'timeGridDay', // Vista semanal con franjas horarias
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
      right: 'timeGridDay'
    },
    events: [] as EventInput[],
    eventContent: (arg) => {
      let tipo = arg.event.extendedProps['tipo'];
      let profesor = arg.event.extendedProps['profesor'] ? `Prof: ${arg.event.extendedProps['profesor']}` : "";
      let nombre = arg.event.extendedProps['nombre'] ? `${arg.event.extendedProps['nombre']}` : "";
      let alumnos = arg.event.extendedProps['alumnos']?.length ? `Alumnos: ${arg.event.extendedProps['alumnos'].join(", ")}` : "";
      let inicio = arg.event.start?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
      let fin = arg.event.end?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

      return {
        html: `
          <div class="evento">
            ${inicio} - ${fin} - ${tipo} - ${arg.event.title} ----  ${profesor} ${nombre}
            <br> ${alumnos} 
            <button class="btn-eliminar" data-id="${arg.event.id}">🗑️</button>
            <button class="btn-editar" data-id="${arg.event.id}">✎</button>
          </div>
        `
      };
    }, 

    eventDidMount: (arg) => {
      let btnEliminar = arg.el.querySelector(".btn-eliminar");
      let btnEditar = arg.el.querySelector(".btn-editar");
  
      if (btnEliminar) {
        btnEliminar.addEventListener("click", () => this.eliminarReserva(Number(arg.event.id)));
      }
  
      if (btnEditar) {
        btnEditar.addEventListener("click", () => this.editarReserva(Number(arg.event.id)));
      }
    }

  }

  canchasActivas:CanchaInterface[]=[];

  obtenerCanchas(reservas: any[]) {
    return Array.from(new Set(reservas.map(r => r.cancha.id)))
      .map(id => reservas.find(r => r.cancha.id === id)?.cancha);
  }

  cargarReservas() {
  
    this.service.getReservas().subscribe(reservas => {
      console.log("Reservas recibidas:", reservas);
      this.canchasActivas = this.obtenerCanchas(reservas);
      this.calendarOptions.events = this.procesarEventos(reservas);
      console.log("Eventos en el calendario:", this.calendarOptions.events);
    });
    
  }

  procesarEventos(reservas: any[]) {
    return reservas.map(r => {
      const fechaISO = this.convertirFechaISO(r.fecha);

      let detalles = "";
      if (r.tipo === "CLASE") {
        detalles = `\nProf: ${r.profe?.nombre || "Sin Profesor"}\nAlumnos: ${r.alumnos?.length || 0}`;
      }
      
      return {
        id: r.id,
        title: `${r.cancha?.nombre || 'Sin Cancha'}`, // Evitar 'undefined'
        start: `${fechaISO}T${r.inicio}`, // Asegurar formato correcto
        end: `${fechaISO}T${r.finalizacion}`, // Asegurar formato correcto
        color: this.obtenerColorPorCancha(r.cancha?.id), 
        extendedProps: {
          cancha: r.cancha,
          nombre: r.nombre, // Evitar 'null'
          tipo: r.tipo || 'General', // Asegurar que no sea undefined
          profesor: r.tipo === 'CLASE' ? r.profe?.nombre || 'Sin Profesor' : null,
          alumnos: r.alumnos?.length ? r.alumnos.map((a: { nombre: any; }) => a.nombre) : [] // Asegurar siempre un array
        }
      };
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
  
    this.service.updateReserva(reservaActualizada.id!, reservaActualizada).subscribe({
      next: () => {
        this.actualizarAlumnos.emit();
        alert('Reserva actualizada con éxito');
      },
      error: (err) => {
        console.error('Error al actualizar reserva:', err);
      },
    });
  }

  eliminarReserva(id: number) {
    if (confirm("¿Seguro que deseas eliminar esta reserva?")) {
      this.service.deleteReserva(id).subscribe({
        next: () => {
          this.actualizarAlumnos.emit();
          alert("Reserva eliminada con éxito");
          this.cargarReservas(); // Recargar eventos
        },
        error: (err) => {
          console.error("Error al eliminar reserva:", err);
        },
      });
    }
  }

  editarReserva(id: number): void {
    // Obtener la reserva por ID desde el servicio
    this.service.getReservaById(id).subscribe({
      next: (data: ReservaInterface) => {
        //console.log("Reserva encontrada:", data);
  
        let dialogData: ClaseInterface | AlqInterface;
  
        // Validar tipo y transformar a ClaseInterface o AlqInterface
        if (data.tipo === "ALQUILER") {
          dialogData = {
            id: data.id,
            tipo: data.tipo,
            cancha: data.cancha,
            nombre: data.nombre,
            fecha: data.fecha,
            inicio: data.inicio,
            finalizacion: data.finalizacion,
            valor: (data as AlqInterface).valor || 0, // Valor específico de alquiler
          } as AlqInterface;
        } else if (data.tipo === "CLASE") {
          dialogData = {
            id: data.id,
            tipo: data.tipo,
            cancha: data.cancha,
            nombre: data.nombre,
            fecha: data.fecha,
            inicio: data.inicio,
            finalizacion: data.finalizacion,
            alumnos: (data as ClaseInterface).alumnos || [], // Alumnos específicos de clase
            profe: (data as ClaseInterface).profe || null, // Profesor específico de clase
          } as ClaseInterface;
        } else {
          console.error("Tipo de reserva desconocido:", data.tipo);
          return; // Salir si el tipo es desconocido
        }
  
        console.log("Objeto transformado para el modal:", dialogData);
  
        // Abrir el modal
        const dialogRef = this.dialog.open(EditReservaModalComponent, {
          width: '500px',
          data: dialogData,
        });
  
        // Manejar el cierre del modal
        dialogRef.afterClosed().subscribe((result: ClaseInterface | AlqInterface) => {
          if (result) {
            // Enviar el objeto actualizado al backend
            this.service.updateReserva(result.id!, result).subscribe({
              next: () => {
                this.actualizarAlumnos.emit();
                alert(`${result.tipo === "CLASE" ? "Clase" : "Alquiler"} actualizado con éxito`);
                this.cargarReservas(); // Recargar el calendario
              },
              error: (err) => {
                console.error(`Error al actualizar la reserva (${result.tipo}):`, err);
              },
            });
          }
        });
      },
      error: (err) => {
        console.error(`No se pudo encontrar una reserva con el ID: ${id}`, err);
      },
    });
  }
  



}


