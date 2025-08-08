import { Component, inject, OnInit } from '@angular/core';
import { CanchaInterface } from '../../../Interface/CanchaInterface';
import { CanchaService } from '../../../Services/cancha.service';

@Component({
  selector: 'app-ver-canchas',
  standalone: true,
  imports: [],
  templateUrl: './ver-canchas.component.html',
  styleUrl: './ver-canchas.component.css'
})
export class VerCanchasComponent implements OnInit{
  ngOnInit(): void {
    this.cargarCanchas()
  }

  canchas: CanchaInterface[] = [];
  mensaje: string = "";
  private service = inject(CanchaService);

  cargarCanchas ():void{

    this.service.getCanchas().subscribe({
      next:(data) => {
        this.canchas=data;
      }, 
      error :(err) => {
        console.log("Error al obtener las canchas", err);
        this.mensaje="No se pudieron cargar las canchas"
      }
    })
  }

  eliminarCancha(id?: number): void {
    if (confirm('¿Seguro que quieres eliminar esta cancha?')) {
      this.service.deleteCancha(id).subscribe({
        next: () => {
          this.canchas = this.canchas.filter(cancha => cancha.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.mensaje = 'No se pudo eliminar el precio.';
        }
      });
    }
  }

}
