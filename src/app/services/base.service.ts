import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T> {
  
  protected baseUrl: string;
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    protected http: HttpClient,
    protected snackBar: MatSnackBar,
    endpoint: string
  ) {
    this.baseUrl = `${environment.apiUrl}/${endpoint}`;
  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  create(entity: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, entity, this.httpOptions);
  }

  read(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  readById(id: string | number): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<T>(url);
  }

  update(entity: T & { [key: string]: any }): Observable<T> {
    // Assumindo que a entidade tem um campo 'id' ou similar
    const id = this.getIdFromEntity(entity);
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<T>(url, entity, this.httpOptions);
  }

  delete(id: number): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<T>(url);
  }

  // Método auxiliar para extrair o ID da entidade
  // Pode ser sobrescrito em serviços específicos se necessário
  protected getIdFromEntity(entity: T & { [key: string]: any }): number | string {
    // Tenta encontrar o ID de várias formas comuns
    return entity.id || entity.cliId || entity.proId || entity.formId || entity.pedId || '';
  }
}



