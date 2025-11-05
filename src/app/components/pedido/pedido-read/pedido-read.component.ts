import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../pedido.model';
import { ClienteService } from '../../Cliente/cliente.service';
import { Cliente } from '../../Cliente/cliente.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pedido-read',
  templateUrl: './pedido-read.component.html',
  styleUrls: ['./pedido-read.component.css']
})
export class PedidoReadComponent implements OnInit {

  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];
  displayedColumns = ['pedId', 'cliente', 'pedData', 'pedValorTotal', 'pedStatus', 'action'];

  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    // Busca pedidos e clientes simultaneamente
    forkJoin({
      pedidos: this.pedidoService.read(),
      clientes: this.clienteService.read()
    }).subscribe(({ pedidos, clientes }) => {
      console.log('Pedidos recebidos do backend:', JSON.stringify(pedidos, null, 2));
      console.log('Clientes recebidos:', clientes);
      
      this.clientes = clientes;
      
      // Processa cada pedido para encontrar o cliente correspondente
      this.pedidos = pedidos.map((pedido: any) => {
        console.log('Processando pedido:', JSON.stringify(pedido, null, 2));
        
        // Tenta encontrar o ID do cliente de várias formas possíveis
        let clienteId: number | null = null;
        
        // 1. Verifica se tem cliId diretamente no pedido
        if (pedido.cliId) {
          clienteId = pedido.cliId;
          console.log('Cliente ID encontrado no pedido (cliId):', clienteId);
        }
        
        // 2. Verifica se tem clienteId no pedido
        else if (pedido.clienteId) {
          clienteId = pedido.clienteId;
          console.log('Cliente ID encontrado no pedido (clienteId):', clienteId);
        }
        
        // 3. Verifica se o objeto cliente tem ID
        else if (pedido.cliente) {
          if (typeof pedido.cliente === 'object') {
            clienteId = pedido.cliente.cliId || pedido.cliente.clienteId || pedido.cliente.id;
            console.log('Cliente ID encontrado no objeto cliente:', clienteId);
          } else if (typeof pedido.cliente === 'number') {
            clienteId = pedido.cliente;
            console.log('Cliente é um número (ID):', clienteId);
          }
        }
        
        // Se encontrou o ID, busca o cliente completo
        if (clienteId && this.clientes.length > 0) {
          const clienteEncontrado = this.clientes.find(c => c.cliId === clienteId);
          if (clienteEncontrado) {
            console.log('Cliente encontrado e atribuído:', clienteEncontrado.cliNome);
            pedido.cliente = clienteEncontrado;
          } else {
            console.log('Cliente não encontrado na lista para ID:', clienteId);
          }
        } else {
          console.log('Nenhum ID de cliente encontrado no pedido');
        }
        
        return pedido;
      });
      
      console.log('Pedidos processados:', this.pedidos);
    });
  }

  getClienteNome(pedido: any): string {
    // Se o cliente já está completo e tem nome
    if (pedido.cliente && pedido.cliente.cliNome) {
      return pedido.cliente.cliNome;
    }
    
    // Tenta buscar pelo ID do cliente
    let clienteId: number | null = null;
    
    if (pedido.cliId) {
      clienteId = pedido.cliId;
    } else if (pedido.clienteId) {
      clienteId = pedido.clienteId;
    } else if (pedido.cliente) {
      if (typeof pedido.cliente === 'object') {
        clienteId = pedido.cliente.cliId || pedido.cliente.clienteId || pedido.cliente.id;
      } else if (typeof pedido.cliente === 'number') {
        clienteId = pedido.cliente;
      }
    }
    
    if (clienteId && this.clientes.length > 0) {
      const cliente = this.clientes.find(c => c.cliId === clienteId);
      if (cliente && cliente.cliNome) {
        return cliente.cliNome;
      }
    }
    
    return 'N/A';
  }
}
