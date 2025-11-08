import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Pedido } from './pedido.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  baseUrl = `${environment.apiUrl}/pedidos`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }

  create(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, pedido, this.httpOptions);
  }

  read(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  readById(pedId: string): Observable<Pedido> {
    const url = `${this.baseUrl}/${pedId}`;
    return this.http.get<Pedido>(url);
  }

  update(pedido: Pedido): Observable<Pedido> {
    const url = `${this.baseUrl}/${pedido.pedId}`;
    return this.http.put<Pedido>(url, pedido, this.httpOptions);
  }

  delete(pedId: number): Observable<Pedido> {
    const url = `${this.baseUrl}/${pedId}`;
    return this.http.delete<Pedido>(url);
  }
}

