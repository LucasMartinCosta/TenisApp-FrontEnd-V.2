import { Component, inject, OnInit } from '@angular/core';
import { ReservaInterface } from '../../../Interface/ReservaInterface';
import { ReservasService } from '../../../Services/reservas.service';

@Component({
  selector: 'app-ver-reservas',
  standalone: true,
  imports: [],
  templateUrl: './ver-reservas.component.html',
  styleUrl: './ver-reservas.component.css'
})
export class VerReservasComponent implements OnInit{

  ngOnInit(): void {
    
    this.cargarReservas();
  }

  reservas:ReservaInterface[]=[];
  mensaje:string = "";
  private reservaService = inject(ReservasService);

  cargarReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
      },
      error: (err) => {
        console.error('Error al obtener las reservas:', err);
        this.mensaje = 'No se pudieron cargar las reservas.';
      }
    });
  }

  eliminarReserva(id?: number): void {
    if (confirm('¿Seguro que quieres eliminar esta reserva?')) {
      this.reservaService.deleteReserva(id).subscribe({
        next: () => {
          this.reservas = this.reservas.filter(reserva => reserva.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.mensaje = 'No se pudo eliminar la reserva.';
        }
      });
    }
  }

}
