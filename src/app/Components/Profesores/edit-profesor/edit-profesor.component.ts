import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfesoresService } from '../../../Services/profesores.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfesorInterface } from '../../../Interface/ProfesorInterface';
import { format } from 'date-fns';

import {MatNativeDateModule } from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule } from '@angular/material/input';
import {MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
    selector: 'app-edit-profesor',
    imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule,
        MatInputModule, MatButtonModule, MatCheckboxModule],
    templateUrl: './edit-profesor.component.html',
    styleUrl: './edit-profesor.component.css'
})
export class EditProfesorComponent implements OnInit{

  profesorForm:FormGroup; 

constructor(
    private fb: FormBuilder,
    private profesoresService: ProfesoresService,
    public dialogRef: MatDialogRef<EditProfesorComponent>,
    @Inject(MAT_DIALOG_DATA) public profesor: ProfesorInterface // Recibimos el alumno como parámetro del diálogo
  ) {
    this.profesorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      celular: ['', [Validators.required]],
      fechaNacimiento: [null, Validators.required],
    });
  }
  
  ngOnInit(): void {
    console.log(this.profesor);
    this.profesorForm.patchValue({
      ...this.profesor,
      fechaNacimiento: this.profesor.fechaNacimiento ? new Date(this.profesor.fechaNacimiento):null,
    });
    
    console.log('Valor en FormControl después de patchValue:', this.profesorForm.value);

  }


   guardarCambios(): void {
      if (this.profesorForm.valid) {
        
        const formValues = this.profesorForm.value;
  
        const profeEditado = {
          ...this.profesor,
          ...formValues,
          fechaNacimiento: formValues.fechaNacimiento
            ? format(formValues.fechaNacimiento, 'dd-MM-yyyy')
            : null
        };
  
        console.log(profeEditado);
  
        this.profesoresService.updateProfesor(this.profesor.id, profeEditado).subscribe({
          next: () => {
            alert('Profesor actualizado correctamente');
            this.dialogRef.close(true); // Cerramos el diálogo y enviamos una señal de éxito
          },
          error: () => {
            alert('Hubo un error al actualizar el profesor');
          }
        });
      }
    }
  
    cancelar(): void {
      this.dialogRef.close(false); // Cerramos el diálogo sin guardar cambios
    }


}
