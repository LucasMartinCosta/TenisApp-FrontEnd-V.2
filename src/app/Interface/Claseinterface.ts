import { AlumnoInterface } from "./AlumnoInterface";
import { ProfesorInterface } from "./ProfesorInterface";
import { ReservaInterface } from "./ReservaInterface";

export interface ClaseInterface extends ReservaInterface{

    alumnos : AlumnoInterface []; 
    profe : ProfesorInterface;

}