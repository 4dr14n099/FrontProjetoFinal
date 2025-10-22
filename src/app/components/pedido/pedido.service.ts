// pedido.service.ts
import { Injectable } from '@angular/core';
import { Pedido } from './pedido.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {

  private pedidos: Pedido[] = [];

  constructor() { }

  // Método para criar um pedido
  criarPedido(pedido: Pedido): Observable<Pedido> {
    this.pedidos.push(pedido); // Aqui você poderia salvar no backend
    return of(pedido); // Retorna o pedido criado
  }

  // Método para obter todos os pedidos (se necessário)
  getPedidos(): Observable<Pedido[]> {
    return of(this.pedidos); // Retorna todos os pedidos
  }
}
