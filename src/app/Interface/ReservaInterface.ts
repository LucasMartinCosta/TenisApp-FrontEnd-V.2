
import { CanchaInterface } from "./CanchaInterface";


export interface ReservaInterface{

    id?:number; 
    nombre:string;
    cancha:CanchaInterface; 
    fecha: string ;
    inicio:string; 
    finalizacion:string; 
    tipo: "CLASE" | "ALQUILER";
}