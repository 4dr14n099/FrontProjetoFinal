import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Produto } from './produto.module';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  baseUrl = `${environment.apiUrl}/produtos`;

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X',{
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }

  create(produto: Produto): Observable<Produto>{
    return this.http.post<Produto>(this.baseUrl, produto)
  }

  read(): Observable<Produto[]>{
    return this.http.get<Produto[]>(this.baseUrl)
  }

  readById(estId: string): Observable<Produto>{
    const url = `${this.baseUrl}/${estId}`
    return this.http.get<Produto>(url)
  }
 
  update(produto: Produto): Observable<Produto>{
    const url = `${this.baseUrl}/${produto.proId}`
    return this.http.put<Produto>(url, produto)
  }
 
  delete(estId: number): Observable<Produto>{    
    const url = `${this.baseUrl}/${estId}`
    return this.http.delete<Produto>(url)
  }
}
