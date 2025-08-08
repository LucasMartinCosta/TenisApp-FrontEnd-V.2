import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartType,
  registerables // Esto importa todos los componentes necesarios
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts'; // Directiva para usar ng2-charts

// Registra todos los componentes de Chart.js
import { Chart } from 'chart.js';
import { AlumnosService } from '../../../Services/alumnos.service';
import { AlumnoInterface } from '../../../Interface/AlumnoInterface';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
Chart.register(...registerables); // ¡Esto es clave para evitar el error!



@Component({
  selector: 'app-torta-alumnos-semana',
  imports: [BaseChartDirective, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './torta-alumnos-semana.component.html',
  styleUrl: './torta-alumnos-semana.component.css'
})
export class TortaAlumnosSemanaComponent implements OnInit{

  private alumnosService = inject(AlumnosService);
  @ViewChild(BaseChartDirective) chartDirective!: BaseChartDirective; // Referencia al gráfico

  // Datos y configuración del gráfico
  public pieChartData: ChartData<'pie'> = {
    labels: ['1 vez por semana', '2 veces por semana', '3 veces por semana'],
    datasets: [
      {
        data: [0, 0, 0], // Se actualizará dinámicamente
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores opcionales
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title:{
        display: true, // Activa el título
        text: 'Frecuencia de alumnos por semana', // Define el texto del título
        font: {
            size: 18, // Tamaño de la fuente del título
            weight: 'bold' // Negrita para el título
        },
        padding: {
            top: 10, // Espaciado encima del título
            bottom: 20 // Espaciado debajo del título
        },
        align: 'center' // Centrar el título
      }
    },  
  };


  alumnos: AlumnoInterface[] = []; // Lista de alumnos (simulada)
  dataPorSemana: number[] = [0, 0, 0]; // Una vez, dos veces, tres veces por semana
  // Valores y resultados para cada frecuencia
  valorUnaVez: number = 0;
  valorDosVeces: number = 0;
  valorTresVeces: number = 0;

  resultadoUnaVez: number | null = null;
  resultadoDosVeces: number | null = null;
  resultadoTresVeces: number | null = null;


  ngOnInit(): void {
    this.cargarAlumnos(); // Cargar alumnos y actualizar datos del gráfico
  }

  cargarAlumnos(): void {
    this.alumnosService.getAlumnos().subscribe({
      next: (data) => {
        // Transformar los datos para que coincidan con la interfaz AlumnoInterface
        const transformedData = data.map((alumno: any) => ({
          ...alumno,
          vecesXsemana: alumno.vecesxSemana, // Cambia la propiedad `vecesxSemana` a `vecesXsemana`
        }));
  
        console.log('Datos transformados:', transformedData);
  
        const counts = [0, 0, 0]; // Contadores
        transformedData.forEach((alumno: AlumnoInterface) => {
          const veces = alumno.vecesXsemana?.trim(); // Usa `vecesXsemana` después de la transformación
          console.log('Valor de vecesXsemana:', veces); // Verifica los valores
          if (veces === 'Uno') counts[0]++;
          else if (veces === 'Dos') counts[1]++;
          else if (veces === 'Tres') counts[2]++;
        });
  
        console.log('Contadores calculados:', counts); // Confirma que los datos sean correctos
        this.pieChartData.datasets[0].data = counts; // Actualiza el gráfico

        // Actualiza el gráfico
        this.chartDirective?.chart?.update();
      },
      error: (e) => console.error('Error al cargar alumnos:', e),
    });
  }

  calcularGanancia(frecuencia: string): void {
    let cantidadAlumnos = 0;
    let valorReferencia = 0;

    // Determina la cantidad de alumnos y el valor de referencia según la frecuencia
    switch (frecuencia) {
      case 'una':
        cantidadAlumnos = this.pieChartData.datasets[0].data[0];
        valorReferencia = this.valorUnaVez;
        this.resultadoUnaVez = cantidadAlumnos * valorReferencia;
        break;
      case 'dos':
        cantidadAlumnos = this.pieChartData.datasets[0].data[1];
        valorReferencia = this.valorDosVeces;
        this.resultadoDosVeces = cantidadAlumnos * valorReferencia;
        break;
      case 'tres':
        cantidadAlumnos = this.pieChartData.datasets[0].data[2];
        valorReferencia = this.valorTresVeces;
        this.resultadoTresVeces = cantidadAlumnos * valorReferencia;
        break;
      default:
        alert('Frecuencia desconocida');
        break;
    }

    console.log(`Ganancias calculadas para ${frecuencia}:`, cantidadAlumnos * valorReferencia);
  }

}
