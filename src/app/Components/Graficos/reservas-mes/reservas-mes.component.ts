import { Component, inject } from '@angular/core';
import { ClaseInterface } from '../../../Interface/Claseinterface';
import { AlqInterface } from '../../../Interface/AlqInterface';
import { ReservasService } from '../../../Services/reservas.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reservas-mes',
  imports: [],
  templateUrl: './reservas-mes.component.html',
  styleUrl: './reservas-mes.component.css'
})
export class ReservasMesComponent {

  clases: ClaseInterface[] = [];
  alqui: AlqInterface[] = [];
  datosMensuales: { [mes: string]: { alquileres: number; clases: number } } = {};

  private reservasService = inject(ReservasService);
  private chart: Chart | null = null; // Propiedad para almacenar la instancia del gráfico


  ngOnInit(): void {
      this.cargarDatos();
  }

  cargarDatos(): void {
      this.reservasService.getAllClases().subscribe({
          next: (clases) => {
              this.clases = clases;
              this.agruparDatosMensuales();
          }
      });

      this.reservasService.getAllAlquileres().subscribe({
          next: (alquileres) => {
              this.alqui = alquileres;
              this.agruparDatosMensuales();
          }
      });
  }

  agruparDatosMensuales(): void {
      // Inicializar los datos mensuales
      this.datosMensuales = {};

      // Procesar clases
      this.clases.forEach((clase) => {
          const mes = this.obtenerMes(clase.fecha);
          if (!this.datosMensuales[mes]) {
              this.datosMensuales[mes] = { alquileres: 0, clases: 0 };
          }
          this.datosMensuales[mes].clases++;
      });

      // Procesar alquileres
      this.alqui.forEach((alquiler) => {
          const mes = this.obtenerMes(alquiler.fecha);
          if (!this.datosMensuales[mes]) {
              this.datosMensuales[mes] = { alquileres: 0, clases: 0 };
          }
          this.datosMensuales[mes].alquileres++;
      });

      console.log('Datos mensuales:', this.datosMensuales); // Validar agrupación
      this.crearGrafico();
  }

  obtenerMes(fecha: string): string {
    const partes = fecha.split('-');
    const fechaNormalizada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    const date = new Date(fechaNormalizada);

    if (isNaN(date.getTime())) {
        console.log("Fecha inválida en obtenerMes:", fecha);
        return "desconocido";
    }

    // Asegúrate de devolver el nombre del mes en minúsculas
    const mes = date.toLocaleString('es-ES', { month: 'long' }).toLowerCase();
    return mes;
}

  crearGrafico(): void {
    // Destruir el gráfico existente si ya está creado
    if (this.chart) {
        this.chart.destroy();
        this.chart = null; // Limpia la referencia del gráfico anterior
    }

       // Definir el orden cronológico de los meses
       const ordenMeses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    // Ordenar los meses basados en el índice predefinido
    const meses = Object.keys(this.datosMensuales).sort((a, b) =>
        ordenMeses.indexOf(a.toLowerCase()) - ordenMeses.indexOf(b.toLowerCase())
    );

    // Obtener datos ordenados para el gráfico
    const alquileres = meses.map((mes) => this.datosMensuales[mes].alquileres);
    const clases = meses.map((mes) => this.datosMensuales[mes].clases);

    // Referencia al canvas donde se renderiza el gráfico
    const ctx = document.getElementById('reservaChart') as HTMLCanvasElement;

    // Crear el gráfico
    this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses, // Etiquetas para los meses
            datasets: [
                {
                    label: 'Alquileres',
                    data: alquileres,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Clases',
                    data: clases,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top' // Posición del legend para mejor visualización
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Etiqueta personalizada
                        }
                    }
                },
                title: {
                    display: true, // Mostrar el título
                    text: 'Cantidad de Reservas por Mes', // Texto del título
                    font: {
                        size: 20, // Tamaño del título
                        weight: 'bold' // Negrita para el título
                    },
                    padding: {
                        top: 20, // Espaciado arriba
                        bottom: 20 // Espaciado abajo
                    },
                    align: 'center' // Centrar el título
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Iniciar en cero para claridad visual
                }
            }
        },
        plugins: [
            {
                id: 'show-values',
                afterDatasetsDraw(chart) {
                    const { ctx } = chart;
                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i);
                        meta.data.forEach((bar, index) => {
                            const value = dataset.data[index];
                            ctx.save();
                            ctx.textAlign = 'center';
                            ctx.font = '12px Arial';
                            ctx.fillStyle = 'black';
                            ctx.fillText(value!.toString(), bar.x, bar.y - 5); // Mostrar el valor encima de la barra
                            ctx.restore();
                        });
                    });
                }
            }
        ]
    });
}

}
