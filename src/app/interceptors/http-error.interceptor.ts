import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro desconhecido';

        if (error.error instanceof ErrorEvent) {
          // Erro do lado do cliente
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          // Erro do lado do servidor
          if (error.status === 0) {
            errorMessage = 'Erro de conexão. Verifique se o backend está rodando.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Requisição inválida';
          } else if (error.status === 401) {
            errorMessage = 'Não autorizado. Faça login novamente.';
          } else if (error.status === 403) {
            errorMessage = 'Acesso negado.';
          } else if (error.status === 404) {
            errorMessage = error.error?.message || 'Recurso não encontrado';
          } else if (error.status === 500) {
            errorMessage = error.error?.message || 'Erro interno do servidor';
          } else {
            errorMessage = error.error?.message || `Erro ${error.status}: ${error.statusText}`;
          }
        }

        // Mostra mensagem de erro apenas se não for um erro 404 esperado (ex: verificar se existe)
        if (error.status !== 404 || request.method === 'GET') {
          this.snackBar.open(errorMessage, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }

        return throwError(() => error);
      })
    );
  }
}

