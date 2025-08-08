
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../Services/alumnos.service';
import { format } from 'date-fns';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlumnoInterface } from '../../../Interface/AlumnoInterface';



@Component({
    selector: 'app-add-alumno',
    imports: [MatCheckboxModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatNativeDateModule, MatInputModule, MatButtonModule],
    templateUrl: './add-alumno.component.html',
    styleUrl: './add-alumno.component.css'
})
export class AddAlumnoComponent implements OnInit{
  
  ngOnInit(): void {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      celular: ['', [Validators.required]],
      mesActualPago: [false, Validators.required],
      vecesXsemana: [null, Validators.required],
      fechaNacimiento: [null, Validators.required]
    });
  }

  @Output() alumnoAgregado = new EventEmitter<void>(); // EventEmitter para emitir actualizar la lista

  alumnoForm!: FormGroup;
  private fb = inject(FormBuilder);
  private alumnoService = inject(AlumnosService);
  private snackBar = inject(MatSnackBar);
  opcionesVecesSemana = ['Uno', 'Dos', 'Tres'];


  agregarAlumno() {
    if (this.alumnoForm.invalid) {
      return;
    }

    const formValues = this.alumnoForm.value;

    const nuevoAlumno: AlumnoInterface = {
      ...formValues,
      fechaNacimiento: format(formValues.fechaNacimiento, 'dd-MM-yyyy')
    };

    this.alumnoService.saveAlumno(nuevoAlumno).subscribe({
      next: () => {
        this.snackBar.open('Alumno agregado con éxito', 'Cerrar', { duration: 3000 });
        this.alumnoForm.reset();
        this.alumnoAgregado.emit(); //emite el evento de la señal para actualizar
      },
      error: (err) => {
        console.error('Error al agregar alumno:', err);
        this.snackBar.open('Error al agregar alumno', 'Cerrar', { duration: 3000 });
      }
    });
  }


}
