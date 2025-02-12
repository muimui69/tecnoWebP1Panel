import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { ReporteService } from '../../../services/reporte.service';
declare var toastr: any;
@Component({
  selector: 'app-reporte',
  templateUrl: './index-reporte.component.html',
  styleUrls: ['./index-reporte.component.css']
})
export class IndexReporteComponent {
  public token = localStorage.getItem('token') || '';
  entidades = ['ventas', 'compras', 'ingresos', 'egresos'];
  entidadSeleccionada = 'ventas';
  fechaInicio = '';
  fechaFin = '';
  email = '';
  asunto = 'Reporte de Datos';
  mensaje = 'Adjunto encontrarás el reporte solicitado.';
  entidad = ''
  reporteDatos: any[] = [];
  isLoading: boolean = false;

  constructor(private reporteService: ReporteService) { }

  generarReporte() {
    if (!this.fechaInicio || !this.fechaFin) {
      toastr.error('Seleccione un rango de fechas válido.');
      return;
    }

    this.isLoading = true;
    this.reporteService.obtenerReporte(this.entidadSeleccionada, this.fechaInicio, this.fechaFin, this.token)
      .subscribe((res: any) => {
        console.log('Reporte obtenido:', res);
        this.reporteDatos = res.data || [];
        this.entidad = res.entidad || '';
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
      toastr.error('Ingrese un correo electrónico válido.');
      return;
    }

    this.reporteService.enviarReporteCorreo({
      entidad: this.entidadSeleccionada,
      inicio: this.fechaInicio,
      fin: this.fechaFin,
      email: this.email,
      asunto: this.asunto,
      mensaje: this.mensaje
    }
      , this.token
    ).subscribe(response => {
      console.log('Reporte enviado:', response);
      toastr.success('Reporte enviado correctamente.');
    }, error => {
      console.error('Error al enviar el reporte:', error);
      toastr.error('Error al enviar el reporte.');
    });
  }
}