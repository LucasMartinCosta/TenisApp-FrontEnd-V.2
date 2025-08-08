import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { AddPrecioComponent } from "../../Components/Precio/add-precio/add-precio.component";

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ClaseInterface } from '../../Interface/Claseinterface';
import { AlqInterface } from '../../Interface/AlqInterface';
import { ReservasService } from '../../Services/reservas.service';
import { Chart } from 'chart.js';
import { ReservasMesComponent } from "../../Components/Graficos/reservas-mes/reservas-mes.component";


@Component({
    selector: 'app-administracion-page',
    imports: [ReactiveFormsModule, MatAutocompleteModule, AddPrecioComponent, MatFormFieldModule, MatListModule, MatCheckboxModule, MatChipsModule, ReservasMesComponent],
    templateUrl: './administracion-page.component.html',
    styleUrl: './administracion-page.component.css'
})
export class AdministracionPageComponent{
    
}
