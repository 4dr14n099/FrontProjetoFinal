import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../components/Cliente/cliente.service';
import { PedidoService } from '../../components/pedido/pedido.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalClientes: number = 0;
  totalPedidos: number = 0;
  carregando: boolean = true;

  constructor(
    private clienteService: ClienteService,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;
    
    forkJoin({
      clientes: this.clienteService.read(),
      pedidos: this.pedidoService.read()
    }).subscribe({
      next: ({ clientes, pedidos }) => {
        this.totalClientes = clientes.length;
        this.totalPedidos = pedidos.length;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.carregando = false;
      }
    });
  }

  // Calcula a porcentagem para o gráfico (normaliza para 100% sendo o maior valor)
  // Se ambos forem 0, mostra 0%. Caso contrário, normaliza pelo maior valor
  getPorcentagemCliente(): number {
    const max = Math.max(this.totalClientes, this.totalPedidos);
    if (max === 0) return 0;
    return (this.totalClientes / max) * 100;
  }

  getPorcentagemPedido(): number {
    const max = Math.max(this.totalClientes, this.totalPedidos);
    if (max === 0) return 0;
    return (this.totalPedidos / max) * 100;
  }

}
