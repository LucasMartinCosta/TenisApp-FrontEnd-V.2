import { Component, EventEmitter, Input, input, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-evento-calendario',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './evento-calendario.component.html',
  styleUrl: './evento-calendario.component.css'
})
export class EventoCalendarioComponent {

  @Input() evento: any;
  @Output() eliminar = new EventEmitter<number>();
  @Output() editar = new EventEmitter<number>();

  eliminarEvento() {
    this.eliminar.emit(this.evento.id);
  }

  editarEvento() {
    this.editar.emit(this.evento.id);
  }

  getNombresAlumnos(evento: any): string {
    return evento.alumnos?.map((a: any) => a.nombre).join(", ") || "Sin alumnos";
  }

}
