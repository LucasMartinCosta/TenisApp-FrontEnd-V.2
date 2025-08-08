export interface AlumnoInterface {

    id?:number; 
    nombre:string; 
    celular:string;
    mesActualPago:boolean
    vecesXsemana:string; // uno - dos - tres
    fechaNacimiento: Date  |  string ;

}