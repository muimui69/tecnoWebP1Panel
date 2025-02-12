import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {

    public url = GLOBAL.url;

    constructor(private _http: HttpClient) { }

    obtenerReporte(entidad: string, inicio: string, fin: string, token: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.get(this.url + `/reporte?entidad=${entidad}&inicio=${inicio}&fin=${fin}`, { headers: headers });
    }

    generarReportePDF(entidad: string, inicio: string, fin: string, token: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.get(this.url + `/reporte/pdf?entidad=${entidad}&inicio=${inicio}&fin=${fin}`, { headers: headers, responseType: 'blob' });
    }

    enviarReporteCorreo(data: any, token: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.post(this.url + '/reporte/enviar', data, { headers: headers });
    }
}