import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormaPagamento } from './formapagamento.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormapagamentoService {

  baseUrl = `${environment.apiUrl}/formapagamentos`;

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X',{
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }

  create(formapagamento: FormaPagamento): Observable<FormaPagamento>{
    return this.http.post<FormaPagamento>(this.baseUrl, formapagamento)
  }

  read(): Observable<FormaPagamento[]>{
    return this.http.get<FormaPagamento[]>(this.baseUrl)
  }

  readById(estId: string): Observable<FormaPagamento>{
    const url = `${this.baseUrl}/${estId}`
    return this.http.get<FormaPagamento>(url)
  }
 
  update(formapagamento: FormaPagamento): Observable<FormaPagamento>{
    const url = `${this.baseUrl}/${formapagamento.formId}`
    return this.http.put<FormaPagamento>(url, formapagamento)
  }
 
  delete(estId: number): Observable<FormaPagamento>{    
    const url = `${this.baseUrl}/${estId}`
    return this.http.delete<FormaPagamento>(url)
  }
}
