import { Component, inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
    selector: 'app-nav-bar',
    imports: [MatToolbarModule, MatIconModule, MatSidenavModule, RouterModule],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  private rutas = inject(Router)

  toggleMenu() {
    this.sidenav.toggle();
  }

  goToHome(){
    this.rutas.navigateByUrl("/home")
  }

}
