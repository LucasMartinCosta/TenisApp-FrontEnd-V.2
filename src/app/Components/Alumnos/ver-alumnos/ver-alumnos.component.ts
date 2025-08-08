import { Component, inject, Input, OnInit } from '@angular/core';
import { AlumnoInterface } from '../../../Interface/AlumnoInterface';
import { AlumnosService } from '../../../Services/alumnos.service';
import { MatSnackBar } from '@angular/material/snack-bar';


import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditAlumnoComponent } from '../edit-alumno/edit-alumno.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';






@Component({
    selector: 'app-ver-alumnos',
    imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, MatNativeDateModule,
        MatDatepickerModule, FormsModule, MatFormFieldModule, MatCheckboxModule, MatInputModule],
    templateUrl: './ver-alumnos.component.html',
    styleUrl: './ver-alumnos.component.css'
})
export class VerAlumnosComponent implements OnInit{
  ngOnInit(): void {
    this.cargarAlumnos();
  }

  alumnos:AlumnoInterface[]=[]; 
  mensaje:string="";
  displayedColumns: string[] = ['id', 'nombre', 'celular', 'vecesXsemana', 'fechaNacimiento', 'acciones'];
  loading: boolean = true;
  alumnoSeleccionado: AlumnoInterface | null = null;

  private alumnoService = inject(AlumnosService);
  private snackBar = inject(MatSnackBar);
  private dialog=inject(MatDialog);

  cargarAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        console.log(data);
        this.alumnos = data
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener los alumnos:', err);
        this.mensaje = 'No se pudieron cargar los alumnos.';
        this.loading = false;
      }
    });
  }

  eliminarAlumno(id?: number): void {
    if (confirm('¿Seguro que quieres eliminar este alumno?')) {
      this.alumnoService.deleteAlumno(id).subscribe({
        next: () => {
          this.alumnos = this.alumnos.filter(alum => alum.id !== id);
          this.snackBar.open('Alumno eliminado correctamente', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.mensaje = 'No se pudo eliminar el alumno.';
        }
      });
    }
  }

  editarAlumno(alumno: AlumnoInterface): void {
    const dialogRef = this.dialog.open(EditAlumnoComponent, {
      width: '450px',
      data: alumno
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarAlumnos(); // Recargamos la lista si se editó un alumno
      }
    });
  }

  enviarWhatsapp(celular: string): void {
    // Asegurarse de que el número esté en formato internacional, sin espacios ni signos
    const numeroLimpio = celular.replace(/\D/g, ''); // Elimina todo menos los números
    const url = `https://wa.me/${numeroLimpio}`;
    window.open(url, '_blank');
  }

  filtroNombre: string = ""; // para el input

buscarPorNombre(): void {
  if (this.filtroNombre.trim() === "") {
    this.cargarAlumnos();
    return;
  }

  this.alumnoService.buscarPorNombreSimilar(this.filtroNombre).subscribe({
    next: (data) => {
      this.alumnos = data;
    },
    error: (err) => {
      console.error('Error al buscar por nombre:', err);
      this.mensaje = 'No se encontraron coincidencias.';
    }
  });
}

filtrarDeudores(): void {
  this.alumnoService.filtrarAlumnosDeudores().subscribe({
    next: (data) => {
      this.alumnos = data;
    },
    error: (err) => {
      console.error('Error al filtrar deudores:', err);
      this.mensaje = 'No se pudieron cargar los alumnos con deuda.';
    }
  });
}

mostrarSoloDeudores: boolean = false;

toggleFiltroDeudores(): void {
  if (this.mostrarSoloDeudores) {
    this.filtrarDeudores();
  } else {
    this.cargarAlumnos();
  }
}

}
