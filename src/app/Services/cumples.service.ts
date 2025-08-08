import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CumpleanieroDTO {
  id: number;
  nombre: string;
  celular: string;
  tipo: string; // "Alumno" o "Profesor"
}

@Injectable({
  providedIn: 'root'
})
export class CumplesService {

  private apiUrl = 'http://localhost:8080/api/cumpleanios/hoy'; // <-- Cambiá esta URL si tu backend está en otro lado

  constructor(private http: HttpClient) { }

  getCumplesHoy(): Observable<CumpleanieroDTO[]> {
    return this.http.get<CumpleanieroDTO[]>(this.apiUrl);
  }

}
