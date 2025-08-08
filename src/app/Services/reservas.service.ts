import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ReservaInterface } from '../Interface/ReservaInterface';
import { ClaseInterface } from '../Interface/Claseinterface';
import { AlqInterface } from '../Interface/AlqInterface';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private url = 'http://localhost:8080/api/reservas';
  private http = inject(HttpClient);

  // Obtener todas las reservas
  getReservas(): Observable<ReservaInterface[]> {
    return this.http.get<ReservaInterface[]>(this.url);
  }

  getReservaById(id: number): Observable<ReservaInterface> {
    return this.http.get<ReservaInterface>(`${this.url}/${id}`).pipe(
     // tap(reserva => console.log("Respuesta recibida:", reserva)), // Verifica el contenido aquí
      map(reserva => {
        if (reserva.tipo === "CLASE") {
          return reserva as ClaseInterface;
        } else if (reserva.tipo === "ALQUILER") {
          return reserva as AlqInterface;
        }
        return reserva;
      }),
      catchError(err => {
        console.error("Error al obtener la reserva:", err);
        return throwError(() => new Error("No se pudo obtener la reserva"));
      })
    );
  }


  // Crear una nueva reserva
  addReserva(reserva: ReservaInterface): Observable<ReservaInterface> {
    return this.http.post<ReservaInterface>(this.url, reserva);
  }

  // Actualizar una reserva existente
  updateReserva(id: number, reserva: ReservaInterface): Observable<ReservaInterface> {
    return this.http.put<ReservaInterface>(`${this.url}/${id}`, reserva);
  }

  // Eliminar una reserva
  deleteReserva(id?: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  getAllClases ():Observable<ClaseInterface[]>{
    return this.http.get<ClaseInterface[]>(`${this.url}/clases`)
  }

  getAllAlquileres ():Observable<AlqInterface[]>{
    return this.http.get<AlqInterface[]>(`${this.url}/alquileres`)
  }

  
}
