import { Component, ViewChild } from '@angular/core';
import { AddAlumnoComponent } from "../../Components/Alumnos/add-alumno/add-alumno.component";
import { VerAlumnosComponent } from "../../Components/Alumnos/ver-alumnos/ver-alumnos.component";

import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TortaAlumnosSemanaComponent } from "../../Components/Graficos/torta-alumnos-semana/torta-alumnos-semana.component";



@Component({
    selector: 'app-alumnos-page',
    imports: [AddAlumnoComponent, VerAlumnosComponent, MatNativeDateModule, MatDatepickerModule, MatDialogModule,
    MatFormFieldModule, MatCheckboxModule, TortaAlumnosSemanaComponent],
    templateUrl: './alumnos-page.component.html',
    styleUrl: './alumnos-page.component.css'
})
export class AlumnosPageComponent {

  @ViewChild(VerAlumnosComponent) verAlumnosComponent!: VerAlumnosComponent;

  onAlumnoAgregado(): void {
   this.verAlumnosComponent.cargarAlumnos()
  }

}
