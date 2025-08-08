import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../Services/alumnos.service';
import { AlumnoInterface } from '../../../Interface/AlumnoInterface';
import {MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { format } from 'date-fns';
import {MatInputModule } from '@angular/material/input';
import {MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
    selector: 'app-edit-alumno',
    imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule,
        MatInputModule, MatButtonModule, MatCheckboxModule
    ],
    templateUrl: './edit-alumno.component.html',
    styleUrl: './edit-alumno.component.css'
})
export class EditAlumnoComponent implements OnInit{

  alumnoForm:FormGroup; 
  opcionesVecesSemana = ['Uno', 'Dos', 'Tres'];

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnosService,
    public dialogRef: MatDialogRef<EditAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public alumno: AlumnoInterface // Recibimos el alumno como parámetro del diálogo
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      celular: ['', [Validators.required]],
      vecesXsemana: ["", Validators.required],
      fechaNacimiento: [null, Validators.required],
      mesActualPago: [false]
    });
  }
  
  ngOnInit(): void {
    console.log(this.alumno);
    this.alumnoForm.get('vecesXsemana')?.setValue(this.alumno.vecesXsemana);

    this.alumnoForm.patchValue({
      ...this.alumno,
      fechaNacimiento: this.alumno.fechaNacimiento ? new Date(this.alumno.fechaNacimiento) : null,
      vecesXsemana: this.alumno.vecesXsemana // Asegurar que coincide con el FormControl
    });

    console.log('Valor en FormControl después de patchValue:', this.alumnoForm.get('vecesXsemana')?.value);
    
  }

  guardarCambios(): void {
    if (this.alumnoForm.valid) {
      
      const formValues = this.alumnoForm.value;

      const alumnoEditado = {
        ...this.alumno,
        ...formValues,
        fechaNacimiento: formValues.fechaNacimiento
          ? format(formValues.fechaNacimiento, 'dd-MM-yyyy')
          : null
      };

      console.log(alumnoEditado);

      this.alumnoService.updateAlumno(this.alumno.id, alumnoEditado).subscribe({
        next: () => {
          alert('Alumno actualizado correctamente');
          this.dialogRef.close(true); // Cerramos el diálogo y enviamos una señal de éxito
        },
        error: () => {
          alert('Hubo un error al actualizar el alumno');
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false); // Cerramos el diálogo sin guardar cambios
  }
}
