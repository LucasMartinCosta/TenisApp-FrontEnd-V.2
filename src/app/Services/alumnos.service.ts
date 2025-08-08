import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlumnoInterface } from '../Interface/AlumnoInterface';


@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

      private url = 'http://localhost:8080/api/alumnos';
      private http = inject(HttpClient);  
    
      
      
      getAlumnos(): Observable<AlumnoInterface[]> {
        return this.http.get<AlumnoInterface[]>(this.url);
      }
    
      
      getAlumnoById(id: number): Observable<AlumnoInterface> {
        return this.http.get<AlumnoInterface>(`${this.url}/${id}`);
      }
    
      
      saveAlumno(alumno: AlumnoInterface): Observable<AlumnoInterface> {
        return this.http.post<AlumnoInterface>(this.url, alumno);
      }
    
      
      updateAlumno(id: number|undefined, alumno: AlumnoInterface): Observable<AlumnoInterface> {
        return this.http.put<AlumnoInterface>(`${this.url}/${id}`, alumno);
      }
    
      
      deleteAlumno(id?: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}`);
      }

      findAlumno (nombre:string) : Observable<AlumnoInterface>{
        return this.http.get<AlumnoInterface>(`${this.url}/buscar/${nombre}`)
      }

      buscarPorNombreSimilar(texto: string): Observable<AlumnoInterface[]> {
        return this.http.get<AlumnoInterface[]>(`${this.url}/buscar/nombre-similar?texto=${texto}`);
      }

      filtrarPorVecesPorSemana(veces: string): Observable<AlumnoInterface[]> {
        return this.http.get<AlumnoInterface[]>(`${this.url}/filtrar/veces?veces=${veces}`);
      }
    
      filtrarAlumnosDeudores(): Observable<AlumnoInterface[]> {
        return this.http.get<AlumnoInterface[]>(`${this.url}/filtrar/cuota-impaga`);
      }




}
