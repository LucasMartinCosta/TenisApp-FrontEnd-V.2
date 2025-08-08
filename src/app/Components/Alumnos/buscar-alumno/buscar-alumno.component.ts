import { Component, OnInit } from '@angular/core';
import { AlumnoInterface } from '../../../Interface/AlumnoInterface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlumnosService } from '../../../Services/alumnos.service';
import { debounceTime, switchMap } from 'rxjs';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-buscar-alumno',
  standalone: true,
  imports: [ ReactiveFormsModule , MatFormFieldModule, MatSelectModule, MatInputModule, MatProgressSpinnerModule, MatTableModule, MatCheckboxModule ],
  templateUrl: './buscar-alumno.component.html',
  styleUrl: './buscar-alumno.component.css'
})
export class BuscarAlumnoComponent implements OnInit {

  alumnos: AlumnoInterface[] = [];
  nombreControl = new FormControl('');
  vecesControl = new FormControl('');
  soloDeudores = new FormControl(false);

  displayedColumns: string[] = ['id', 'nombre', 'fechaNacimiento', 'celular', 'mesActualPago', 'vecesXsemana'];
  loading = false;
  sinResultados = false;

  constructor(private alumnosService: AlumnosService) {}

  ngOnInit(): void {
    this.nombreControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(nombre => this.alumnosService.buscarPorNombreSimilar(nombre || ''))
      )
      .subscribe(alumnos => {
        this.alumnos = alumnos;
        this.sinResultados = alumnos.length === 0;
      });
  }

  aplicarFiltros() {
    this.loading = true;
    const veces = this.vecesControl.value;
    const esDeudor = this.soloDeudores.value;

    if (esDeudor) {
      this.alumnosService.filtrarAlumnosDeudores().subscribe(alumnos => {
        this.alumnos = veces ? alumnos.filter(a => a.vecesXsemana === veces) : alumnos;
        this.loading = false;
        this.sinResultados = this.alumnos.length === 0;
      });
    } else if (veces) {
      this.alumnosService.filtrarPorVecesPorSemana(veces).subscribe(alumnos => {
        this.alumnos = alumnos;
        this.loading = false;
        this.sinResultados = alumnos.length === 0;
      });
    } else {
      this.loading = false;
    }
  }

}
