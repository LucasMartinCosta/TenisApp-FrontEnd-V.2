import { Component, ViewChild } from '@angular/core';
import { AddProfesorComponent } from "../../Components/Profesores/add-profesor/add-profesor.component";


import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import { VerProfesoresComponent } from "../../Components/Profesores/ver-profesores/ver-profesores.component";

@Component({
    selector: 'app-profesores-page',
    imports: [AddProfesorComponent, MatDatepickerModule, MatDialogModule, MatNativeDateModule, VerProfesoresComponent],
    templateUrl: './profesores-page.component.html',
    styleUrl: './profesores-page.component.css'
})
export class ProfesoresPageComponent {
  @ViewChild(VerProfesoresComponent) verProfesoresComponent!: VerProfesoresComponent;

  onProfeAgregado(): void {
   this.verProfesoresComponent.cargarProfes()
  }
}
