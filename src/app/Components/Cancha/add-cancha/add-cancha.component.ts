import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanchaInterface } from '../../../Interface/CanchaInterface';
import { CanchaService } from '../../../Services/cancha.service';

@Component({
  selector: 'app-add-cancha',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-cancha.component.html',
  styleUrl: './add-cancha.component.css'
})
export class AddCanchaComponent {

  canchaForm: FormGroup;
    mensaje: string = '';
  
    constructor(private fb: FormBuilder, private service: CanchaService) {
      this.canchaForm = this.fb.group({
        nombre: ['', Validators.required]
      });
    }
  
    guardarCancha() {
      if (this.canchaForm.valid) {
        const canchaNueva: CanchaInterface = this.canchaForm.value;
        this.service.saveCancha(canchaNueva).subscribe({
          next: () => {
            this.mensaje = 'Cancha agregada correctamente';
            this.canchaForm.reset();
          },
          error: (err) => {
            console.error('Error al guardar:', err);
            this.mensaje = 'Error al guardar el precio';
          }
        });
      }
    }


  }