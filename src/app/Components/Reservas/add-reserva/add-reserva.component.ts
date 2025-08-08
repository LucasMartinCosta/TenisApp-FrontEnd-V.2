import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanchaInterface } from '../../../Interface/CanchaInterface';
import { ReservasService } from '../../../Services/reservas.service';
import { CanchaService } from '../../../Services/cancha.service';
import { ReservaInterface } from '../../../Interface/ReservaInterface';
import { format } from 'date-fns';

// Importaciones de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AlumnoInterface } from '../../../Interface/AlumnoInterface';
import { ProfesorInterface } from '../../../Interface/ProfesorInterface';
import { Preciointerface } from '../../../Interface/PrecioInterface';
import { PrecioService } from '../../../Services/precio.service';
import { AlumnosService } from '../../../Services/alumnos.service';
import { ProfesoresService } from '../../../Services/profesores.service';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';

@Component({
    selector: 'app-add-reserva',
    imports: [ReactiveFormsModule, // Angular Material
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule],
    templateUrl: './add-reserva.component.html',
    styleUrl: './add-reserva.component.css'
})
export class AddReservaComponent implements OnInit{
  ngOnInit(): void {
    this.reservaForm = this.fb.group({
      cancha: [null, Validators.required], 
      fecha: [null, Validators.required], 
      inicio: ['', Validators.required], 
      finalizacion: ['', Validators.required], 
      tipo: ["", Validators.required], 
      alumnos: this.fb.array([])  // FormArray para alumnos
    });

    this.cargarCanchas();
    this.cargarPrecios();
    this.cargarAlumnos();
    this.cargarProfes();

    this.reservaForm.get('tipo')?.valueChanges.subscribe((tipo) => {
      this.tipoSeleccionado = tipo;
      this.actualizarFormulario(tipo);
    });
  }

  reservaForm!: FormGroup;
  canchas: CanchaInterface[] = []; // Lista de canchas disponibles
  precios: Preciointerface[] = [];
  alumnos: AlumnoInterface[] = [];
  alumnosSeleccionados: AlumnoInterface[]=[];
  profesores: ProfesorInterface[] = [];
  tipoSeleccionado: 'clase' | 'alquiler' | null = null;

  @Output() alumnosCambiaron = new EventEmitter<AlumnoInterface[]>(); 
  @Output() actualizarAlumnos = new EventEmitter<void>(); 

  private fb = inject(FormBuilder);
  private reservaService = inject(ReservasService);
  private canchasService = inject(CanchaService);
  private preciosService = inject(PrecioService); 
  private alumnosService = inject(AlumnosService);
  private profesorService = inject(ProfesoresService);

  get alumnosArray(): FormArray {
    return this.reservaForm.get('alumnos') as FormArray;
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

  cargarPrecios(){
    this.preciosService.getPrecios().subscribe({
      next:(dato) => {
        this.precios=dato
      }, 
      error:(err)=>{
        console.log("Error al cargar los precios", err);
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

  actualizarFormulario(tipo: 'clase' | 'alquiler') {
    if (tipo === 'clase') {
      this.reservaForm.addControl('profesor', this.fb.control(null, Validators.required));
      if (!this.reservaForm.get('alumnos')) {
        this.reservaForm.addControl('alumnos', this.fb.array([], Validators.required));
      };
      this.reservaForm.removeControl('valor');
    } else if (tipo === 'alquiler') {
      this.reservaForm.addControl('valor', this.fb.control(null, Validators.required));
      this.reservaForm.addControl('nombre', this.fb.control("", Validators.required));
      this.reservaForm.removeControl('profesor');
      this.reservaForm.removeControl('alumnos');
    }
  }

  agregarReserva() {
    if (this.reservaForm.invalid) return;
  
    const formValues = this.reservaForm.value;
  
    const nuevaReserva: ReservaInterface = {
      ...formValues,
      tipo: formValues.tipo.toUpperCase(),
      fecha: format(formValues.fecha, 'dd-MM-yyyy'), // Asegurar formato correcto
      cancha: Number(formValues.cancha), // Enviar un objeto con el ID de la cancha
      profesor: formValues.profesor, // ID del profesor
      alumnos: this.alumnosSeleccionados.map(alumno => alumno.id), // Solo IDs
      nombre: formValues.tipo.toUpperCase() === 'ALQUILER' ? formValues.nombre : null // Solo si es alquiler
    };
    console.log('Formulario enviado:', formValues);
    console.log(nuevaReserva);
  
    this.reservaService.addReserva(nuevaReserva).subscribe({
      next: (res) => {
        console.log("REserva agregada",res);
        alert('Reserva agregada con éxito');
        this.actualizarAlumnos.emit();

      },
      error: (err) => {
        console.error('Error en la solicitud:', err);
      }
    });
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
  }

  
}
