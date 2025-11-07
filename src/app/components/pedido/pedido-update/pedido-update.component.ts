import { Component, OnInit } from '@angular/core';
import { Pedido } from '../pedido.model';
import { PedidoService } from '../pedido.service';
import { ClienteService } from '../../Cliente/cliente.service';
import { Cliente } from '../../Cliente/cliente.model';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pedido-update',
  templateUrl: './pedido-update.component.html',
  styleUrls: ['./pedido-update.component.css']
})
export class PedidoUpdateComponent implements OnInit {

  pedido: Pedido = {
    cliente: {} as Cliente,
    pedValorTotal: 0,
    pedStatus: 'Pendente'
  }

  clientes: Cliente[] = [];

  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const pedId = this.route.snapshot.paramMap.get('pedId');
    if (pedId) {
      // Carregar pedido e clientes simultaneamente
      forkJoin({
        pedido: this.pedidoService.readById(pedId),
        clientes: this.clienteService.read()
      }).subscribe(({ pedido, clientes }) => {
        this.clientes = clientes;
        this.pedido = pedido;
        
        // Formatar data para o input
        if (pedido.pedData) {
          const date = new Date(pedido.pedData);
          this.pedido.pedData = date.toISOString().split('T')[0];
        }

        // Tratar o cliente - pode vir como objeto completo, apenas ID ou referência
        let clienteId: number | null = null;
        
        if (pedido.cliId) {
          clienteId = pedido.cliId;
        } else if (pedido.cliente) {
          if (typeof pedido.cliente === 'object' && pedido.cliente.cliId) {
            clienteId = pedido.cliente.cliId;
          } else if (typeof pedido.cliente === 'number') {
            clienteId = pedido.cliente;
          }
        }

        // Se encontrou o ID, buscar o cliente completo na lista
        if (clienteId && this.clientes.length > 0) {
          const clienteEncontrado = this.clientes.find(c => c.cliId === clienteId);
          if (clienteEncontrado) {
            this.pedido.cliente = clienteEncontrado;
          } else {
            // Se não encontrou, criar um objeto mínimo com o ID
            this.pedido.cliente = { cliId: clienteId } as Cliente;
          }
        }
      });
    } else {
      this.carregarClientes();
    }
  }

  carregarClientes(): void {
    this.clienteService.read().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  updatePedido(): void {
    // Validações
    if (!this.pedido.pedId) {
      this.pedidoService.showMessage('ID do pedido não encontrado!');
      return;
    }

    if (!this.pedido.cliente || !this.pedido.cliente.cliId) {
      this.pedidoService.showMessage('Selecione um cliente!');
      return;
    }
    
    if (!this.pedido.pedValorTotal || this.pedido.pedValorTotal <= 0) {
      this.pedidoService.showMessage('Informe um valor total válido!');
      return;
    }

    // Garantir que a data do pedido está preenchida
    if (!this.pedido.pedData) {
      this.pedido.pedData = new Date().toISOString().split('T')[0];
    }

    // Preparar dados para envio conforme estrutura do backend
    const pedidoParaEnviar: any = {
      pedId: this.pedido.pedId,
      cliente: {
        cliId: this.pedido.cliente.cliId
      },
      pedData: this.pedido.pedData,
      pedValorTotal: Number(this.pedido.pedValorTotal),
      pedStatus: this.pedido.pedStatus || 'Pendente'
    };

    // Adicionar campo opcional apenas se existir
    if (this.pedido.pedObservacoes && this.pedido.pedObservacoes.trim()) {
      pedidoParaEnviar.pedObservacoes = this.pedido.pedObservacoes.trim();
    }

    this.pedidoService.update(pedidoParaEnviar).subscribe({
      next: (response) => {
        this.pedidoService.showMessage('Pedido atualizado com sucesso!');
        this.router.navigate(['/fpedido']);
      },
      error: (error) => {
        console.error('Erro ao atualizar pedido:', error);
        let errorMessage = 'Erro desconhecido ao atualizar pedido';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        if (error.status === 0) {
          errorMessage = 'Erro de conexão. Verifique se o backend está rodando.';
        }
        this.pedidoService.showMessage(`Erro: ${errorMessage}`);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fpedido']);
  }
}
