import { Component, inject } from '@angular/core';
import { PrecioService } from '../../../Services/precio.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Preciointerface } from '../../../Interface/PrecioInterface';

@Component({
    selector: 'app-add-precio',
    imports: [ReactiveFormsModule],
    templateUrl: './add-precio.component.html',
    styleUrl: './add-precio.component.css'
})
export class AddPrecioComponent {

  precioForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private precioService: PrecioService) {
    this.precioForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  guardarPrecio() {
    if (this.precioForm.valid) {
      const nuevoPrecio: Preciointerface = this.precioForm.value;
      this.precioService.savePrecio(nuevoPrecio).subscribe({
        next: () => {
          this.mensaje = 'Precio agregado correctamente';
          this.precioForm.reset();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.mensaje = 'Error al guardar el precio';
        }
      });
    }
  }



}
