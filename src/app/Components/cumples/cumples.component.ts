import { Component, OnInit } from '@angular/core';
import { CumpleanieroDTO, CumplesService } from '../../Services/cumples.service';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-cumples',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './cumples.component.html',
  styleUrl: './cumples.component.css'
})
export class CumplesComponent implements OnInit{

  cumpleanieros: CumpleanieroDTO[] = [];

  constructor(private cumplesService: CumplesService) { }

  ngOnInit(): void {
    this.cumplesService.getCumplesHoy().subscribe({
      next: (data) => {
        this.cumpleanieros = data ?? [];
      },
      error: (error) => {
        console.error('Error al obtener los cumpleaños:', error);
      }
    });
  }

  abrirWhatsApp(celular: string): void {
    const url = `https://wa.me/${celular.replace(/\D/g, '')}`;
    window.open(url, '_blank');
  }



}
