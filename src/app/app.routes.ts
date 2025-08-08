import { Routes } from '@angular/router';
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { ReservasCalendarioComponent } from './Components/reservas-calendario/reservas-calendario.component';
import { AlumnosPageComponent } from './Pages/alumnos-page/alumnos-page.component';
import { ProfesoresPageComponent } from './Pages/profesores-page/profesores-page.component';
import { AdministracionPageComponent } from './Pages/administracion-page/administracion-page.component';

export const routes: Routes = [

    {path:"", component:HomePageComponent}, 
    {path:"home",  component:HomePageComponent},
    {path:"calendar",  component:ReservasCalendarioComponent},
    {path:"alumnos",  component:AlumnosPageComponent},
    {path:"profesores",  component:ProfesoresPageComponent},
    {path:"administracion",  component:AdministracionPageComponent},
    
    
    
];
