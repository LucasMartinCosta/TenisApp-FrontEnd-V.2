import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Preciointerface } from '../Interface/PrecioInterface';

@Injectable({
  providedIn: 'root'
})
export class PrecioService {

  private url = 'http://localhost:8080/api/precios';
  private http = inject(HttpClient);

  // Obtener todos los precios
  getPrecios(): Observable<Preciointerface[]> {
    return this.http.get<Preciointerface[]>(this.url);
  }

  // Obtener un precio por ID
  getPrecioById(id: number): Observable<Preciointerface> {
    return this.http.get<Preciointerface>(`${this.url}/${id}`);
  }

  // Crear un nuevo precio
  savePrecio(precio: Preciointerface): Observable<Preciointerface> {
    return this.http.post<Preciointerface>(this.url, precio);
  }

  // Actualizar un precio existente
  updatePrecio(id: number, precio: Preciointerface): Observable<Preciointerface> {
    return this.http.put<Preciointerface>(`${this.url}/${id}`, precio);
  }

  // Eliminar un precio por ID
  deletePrecio(id?: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

}
