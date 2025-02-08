import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { ReporteService } from '../../../services/reporte.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './index-reporte.component.html',
  styleUrls: ['./index-reporte.component.css']
})
export class IndexReporteComponent {
  public token = localStorage.getItem('token') || '';
  entidades = ['ventas', 'ingresos'];
  entidadSeleccionada = 'ventas';
  fechaInicio = '';
  fechaFin = '';
  email = '';
  asunto = 'Reporte de Datos';
  mensaje = 'Adjunto encontrarás el reporte solicitado.';

  reporteDatos: any[] = [];
  isLoading: boolean = false;

  constructor(private reporteService: ReporteService) { }

  generarReporte() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Seleccione un rango de fechas válido.');
      return;
    }

    this.isLoading = true;
    this.reporteService.obtenerReporte(this.entidadSeleccionada, this.fechaInicio, this.fechaFin, this.token)
      .subscribe((res: any) => {
        this.reporteDatos = res.data || [];
        this.isLoading = false;
        if (this.reporteDatos.length === 0) {
          alert('No hay datos en el rango de fechas seleccionado.');
        }
      }, error => {
        console.error('Error al obtener el reporte:', error);
        this.isLoading = false;
      });
  }

  descargarPDF() {
    if (this.reporteDatos.length === 0) {
      alert('No hay datos disponibles para descargar.');
      return;
    }

    this.reporteService.generarReportePDF(this.entidadSeleccionada, this.fechaInicio, this.fechaFin, this.token)
      .subscribe((res: Blob) => {
        saveAs(res, `Reporte_${this.entidadSeleccionada}.pdf`);
      }, error => {
        console.error('Error al generar el reporte:', error);
      });
  }

  enviarReporte() {
    if (!this.email) {
      alert('Ingrese un correo válido.');
      return;
    }

    this.reporteService.enviarReporteCorreo(
      this.entidadSeleccionada,
      this.fechaInicio,
      this.fechaFin,
      this.email,
      this.asunto,
      this.mensaje,
      this.token
    ).subscribe(response => {
      alert('Reporte enviado correctamente.');
    }, error => {
      console.error('Error al enviar el reporte:', error);
    });
  }
}
