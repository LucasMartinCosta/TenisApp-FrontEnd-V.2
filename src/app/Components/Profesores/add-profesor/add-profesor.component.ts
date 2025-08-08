import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfesoresService } from '../../../Services/profesores.service';
import { ProfesorInterface } from '../../../Interface/ProfesorInterface';
import { format } from 'date-fns';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';






@Component({
    selector: 'app-add-profesor',
    imports: [ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatButtonModule],
    templateUrl: './add-profesor.component.html',
    styleUrl: './add-profesor.component.css'
})
export class AddProfesorComponent implements OnInit{
  ngOnInit(): void {
    this.profesorForm = this.fb.group({
          nombre: ['', [Validators.required, Validators.minLength(3)]],
          celular: ['', [Validators.required]],
          fechaNacimiento: [null, Validators.required]
        });
  }

  @Output() profesorAgregado = new EventEmitter<void>();

  profesorForm!: FormGroup;
  private fb = inject(FormBuilder);
  private profesorService = inject(ProfesoresService);
  private snackBar = inject(MatSnackBar);

  agregarProfe() {
      if (this.profesorForm.invalid) {
        return;
      }
  
      const formValues = this.profesorForm.value;
  
      const nuevoProfe: ProfesorInterface = {
        ...formValues,
        fechaNacimiento: format(formValues.fechaNacimiento, 'dd-MM-yyyy')
      };
  
      this.profesorService.saveProfesor(nuevoProfe).subscribe({
        next: () => {
          this.snackBar.open('Profesor agregado con éxito', 'Cerrar', { duration: 3000 });
          this.profesorAgregado.emit();
          this.profesorForm.reset();
        },
        error: (err) => {
          console.error('Error al agregar profesor:', err);
          this.snackBar.open('Error al agregar profesor', 'Cerrar', { duration: 3000 });
        }
      });
    }


}

  