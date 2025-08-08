import { Component, inject, OnInit } from '@angular/core';
import { ProfesorInterface } from '../../../Interface/ProfesorInterface';
import { ProfesoresService } from '../../../Services/profesores.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditProfesorComponent } from '../edit-profesor/edit-profesor.component';

import {MatCardModule} from '@angular/material/card';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-ver-profesores',
    imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, MatNativeDateModule,
        MatDatepickerModule],
    templateUrl: './ver-profesores.component.html',
    styleUrl: './ver-profesores.component.css'
})
export class VerProfesoresComponent implements OnInit{


  ngOnInit(): void {
    this.cargarProfes();
  }

    profesores:ProfesorInterface[]=[]; 
    mensaje:string="";
    displayedColumns: string[] = ['id', 'nombre', 'celular', 'fechaNacimiento', 'acciones'];
    loading: boolean = true;
    profeSeleccionado: ProfesorInterface | null = null;
  
    private profesService = inject(ProfesoresService);
    private snackBar = inject(MatSnackBar);
    private dialog=inject(MatDialog);

    cargarProfes(): void {
      this.profesService.getProfesores().subscribe({
        next: (data) => {
          console.log(data);
          this.profesores = data
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener los profes:', err);
          this.mensaje = 'No se pudieron cargar los profes.';
          this.loading = false;
        }
      });
    }

    eliminarProfesor(id?: number): void {
      if (confirm('¿Seguro que quieres eliminar este alumno?')) {
        this.profesService.deleteProfesor(id).subscribe({
          next: () => {
            this.profesores = this.profesores.filter(prof => prof.id !== id);
            this.snackBar.open('Profesor eliminado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.mensaje = 'No se pudo eliminar el profesor.';
          }
        });
      }
    }

    editarProfesor(profe: ProfesorInterface): void {
        const dialogRef = this.dialog.open(EditProfesorComponent, {
          width: '400px',
          data: profe
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.cargarProfes(); // Recargamos la lista si se editó un alumno
          }
        });
      }

      enviarWhatsapp(celular: string): void {
        // Asegurarse de que el número esté en formato internacional, sin espacios ni signos
        const numeroLimpio = celular.replace(/\D/g, ''); // Elimina todo menos los números
        const url = `https://wa.me/${numeroLimpio}`;
        window.open(url, '_blank');
      }

}
