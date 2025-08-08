import { Component, EventEmitter, inject, Inject, OnInit, Output } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CanchaInterface } from '../../../Interface/CanchaInterface';
import { ProfesorInterface } from '../../../Interface/ProfesorInterface';
import { AlumnoInterface } from '../../../Interface/AlumnoInterface';
import { ReservaInterface } from '../../../Interface/ReservaInterface';
import { ClaseInterface } from '../../../Interface/Claseinterface';
import { AlqInterface } from '../../../Interface/AlqInterface';
import { CanchaService } from '../../../Services/cancha.service';
import { AlumnosService } from '../../../Services/alumnos.service';
import { ProfesoresService } from '../../../Services/profesores.service';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule } from '@angular/material/input';
import {MatButtonModule } from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';




@Component({
    selector: 'app-edit-reserva-modal',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatDialogModule, MatInputModule, MatButtonModule, MatChipsModule],
    templateUrl: './edit-reserva-modal.component.html',
    styleUrl: './edit-reserva-modal.component.css'
})
export class EditReservaModalComponent implements OnInit{
  ngOnInit(): void {
    
    this.tipo = this.data.tipo;
    this.cargarCanchas();
    this.cargarProfes();
    this.cargarAlumnos();
    this.alumnosSeleccionados=this.data.alumnos;

    console.log("INFO QUE LLEGA AL MODAL?",this.data);
   

    // Crear el formulario dinámico
    this.reservaForm = this.fb.group({
      cancha: [this.data.cancha, Validators.required],
    });

    if (this.tipo === 'ALQUILER') {
      this.reservaForm.addControl('nombre', this.fb.control(this.data.nombre, Validators.required));
    } else if (this.tipo === 'CLASE') {
      this.reservaForm.addControl('profesor',this.fb.control(this.data.profesor, Validators.required));
      this.reservaForm.addControl('alumnos', this.fb.control(this.alumnosSeleccionados, Validators.required));
    }
  }

  constructor(
    private fb: FormBuilder,

    public dialogRef: MatDialogRef<EditReservaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

    private canchasService = inject(CanchaService);
    private alumnosService = inject(AlumnosService);
    private profesorService = inject(ProfesoresService);

  reservaForm!: FormGroup;
  tipo!: 'ALQUILER' | 'CLASE';
  canchas!: CanchaInterface[];
  profesores!: ProfesorInterface[];
  alumnos!: AlumnoInterface[];


  alumnosSeleccionados: AlumnoInterface[]=[];

  @Output() alumnosCambiaron = new EventEmitter<AlumnoInterface[]>(); 

  reservaActualizada!:ReservaInterface;

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.reservaForm.valid) {
      let reservaActualizada: AlqInterface | ClaseInterface;
  
      if (this.tipo === 'ALQUILER') {
        reservaActualizada = {
          id: this.data.id,
          tipo: 'ALQUILER',
          cancha: this.reservaForm.value.cancha,
          nombre: this.reservaForm.value.nombre,
          fecha: this.data.fecha,
          inicio: this.data.inicio,
          finalizacion: this.data.finalizacion,
        } as AlqInterface;
        console.log("reserva antes de enviar a guardar:",reservaActualizada);
        this.dialogRef.close(reservaActualizada); // Pass directly for 'alquiler'
        return;
      }
  
      if (this.tipo === 'CLASE') {
        reservaActualizada = {
          id: this.data.id,
          tipo: 'CLASE',
          cancha: this.reservaForm.value.cancha,
          profe: this.reservaForm.value.profesor,
          alumnos: this.reservaForm.value.alumnos,
          fecha: this.data.fecha,
          inicio: this.data.inicio,
          finalizacion: this.data.finalizacion,
        } as ClaseInterface;
        this.dialogRef.close(reservaActualizada); // Pass directly for 'clase'
        return;
      }
    }
  }


  alumnoSeleccionado(alumno: AlumnoInterface): boolean {
    return this.alumnosSeleccionados.some(a => a.id === alumno.id);
  }


  seleccionarAlumno(alumno: AlumnoInterface) {
    if (this.alumnoSeleccionado(alumno)) {
      this.alumnosSeleccionados = this.alumnosSeleccionados.filter(a => a.id !== alumno.id);
    } else {
      this.alumnosSeleccionados.push(alumno);
    }
    this.alumnosCambiaron.emit(this.alumnosSeleccionados); 
  }

  quitarAlumno(alumno: AlumnoInterface) {
    this.alumnosSeleccionados = this.alumnosSeleccionados.filter(a => a.id !== alumno.id);
    this.reservaForm.patchValue({
      alumnos: this.alumnosSeleccionados // Actualiza el formulario con la lista modificada
    });
  }

  cargarCanchas(){

    this.canchasService.getCanchas().subscribe({
      next:(dato) => {
        this.canchas=dato
      }, 
      error:(err)=>{
        console.log("Error al cargar las canchas", err);
      }
    })
  }

  cargarAlumnos(){
    this.alumnosService.getAlumnos().subscribe({
      next:(dato) => {
        this.alumnos=dato
      }, 
      error:(err)=>{
        console.log("Error al cargar los Alumnos", err);
      }
    })
  }

  cargarProfes(){
    this.profesorService.getProfesores().subscribe({
      next:(dato) => {
        this.profesores=dato
      }, 
      error:(err)=>{
        console.log("Error al cargar los Profesores", err);
      }
    })
  }

  compareCancha(o1: CanchaInterface, o2: CanchaInterface): boolean {
    return o1 && o2 && o1.id === o2.id; // Comparar por ID
  }

  compareProfesor(o1: ProfesorInterface, o2: ProfesorInterface): boolean {
    return o1 && o2 && o1.id === o2.id; // Comparar por ID
  }




}
