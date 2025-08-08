import { Component } from '@angular/core';
import { Preciointerface } from '../../../Interface/PrecioInterface';
import { PrecioService } from '../../../Services/precio.service';

@Component({
  selector: 'app-ver-precios',
  standalone: true,
  imports: [],
  templateUrl: './ver-precios.component.html',
  styleUrl: './ver-precios.component.css'
})
export class VerPreciosComponent {

  precios: Preciointerface[] = [];
  mensaje: string = '';

  constructor(private precioService: PrecioService) {}

  ngOnInit(): void {
    this.cargarPrecios();
  }

  cargarPrecios(): void {
    this.precioService.getPrecios().subscribe({
      next: (data) => {
        this.precios = data;
      },
      error: (err) => {
        console.error('Error al obtener los precios:', err);
        this.mensaje = 'No se pudieron cargar los precios.';
      }
    });
  }

  eliminarPrecio(id?: number): void {
    if (confirm('¿Seguro que quieres eliminar este precio?')) {
      this.precioService.deletePrecio(id).subscribe({
        next: () => {
          this.precios = this.precios.filter(precio => precio.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.mensaje = 'No se pudo eliminar el precio.';
        }
      });
    }
  }

}
