import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfesorInterface } from '../Interface/ProfesorInterface';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {

  private url = 'http://localhost:8080/api/profesores';
        private http = inject(HttpClient);  
      
        
        // Obtener todos los precios
        getProfesores(): Observable<ProfesorInterface[]> {
          return this.http.get<ProfesorInterface[]>(this.url);
        }
      
        // Obtener un precio por ID
        getProfesorById(id: number): Observable<ProfesorInterface> {
          return this.http.get<ProfesorInterface>(`${this.url}/${id}`);
        }
      
        // Crear un nuevo precio
        saveProfesor(profe: ProfesorInterface): Observable<ProfesorInterface> {
          return this.http.post<ProfesorInterface>(this.url, profe);
        }
      
        // Actualizar un precio existente
        updateProfesor(id: number|undefined, profe: ProfesorInterface): Observable<ProfesorInterface> {
          return this.http.put<ProfesorInterface>(`${this.url}/${id}`, profe);
        }
      
        // Eliminar un precio por ID
        deleteProfesor(id?: number): Observable<any> {
          return this.http.delete(`${this.url}/${id}`);
        }
}
