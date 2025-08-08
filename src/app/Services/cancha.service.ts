import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanchaInterface } from '../Interface/CanchaInterface';

@Injectable({
  providedIn: 'root'
})
export class CanchaService {

  private url = 'http://localhost:8080/api/canchas';
    private http = inject(HttpClient);
  
    // Obtener todos los precios
    getCanchas(): Observable<CanchaInterface[]> {
      return this.http.get<CanchaInterface[]>(this.url);
    }
  
    // Obtener un precio por ID
    getCanchaById(id: number): Observable<CanchaInterface> {
      return this.http.get<CanchaInterface>(`${this.url}/${id}`);
    }
  
    // Crear un nuevo precio
    saveCancha(cancha: CanchaInterface): Observable<CanchaInterface> {
      return this.http.post<CanchaInterface>(this.url, cancha);
    }
  
    // Actualizar un precio existente
    updateCancha(id: number, cancha: CanchaInterface): Observable<CanchaInterface> {
      return this.http.put<CanchaInterface>(`${this.url}/${id}`, cancha);
    }
  
    // Eliminar un precio por ID
    deleteCancha(id?: number): Observable<any> {
      return this.http.delete(`${this.url}/${id}`);
    }
}
