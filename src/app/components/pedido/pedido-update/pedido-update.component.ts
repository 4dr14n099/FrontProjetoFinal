import { Component, OnInit } from '@angular/core';
import { Pedido } from '../pedido.model';
import { PedidoService } from '../pedido.service';
import { ClienteService } from '../../Cliente/cliente.service';
import { Cliente } from '../../Cliente/cliente.model';
import { ActivatedRoute, Router } from '@angular/router';

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
      this.pedidoService.readById(pedId).subscribe(pedido => {
        this.pedido = pedido;
        // Formatar data para o input
        if (pedido.pedData) {
          const date = new Date(pedido.pedData);
          this.pedido.pedData = date.toISOString().split('T')[0];
        }
      });
    }
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.read().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  updatePedido(): void {
    if (this.pedido.pedId && this.pedido.cliente?.cliId) {
      // Preparar dados para envio
      const pedidoParaEnviar: any = {
        pedId: this.pedido.pedId,
        cliente: {
          cliId: this.pedido.cliente.cliId
        },
        pedData: this.pedido.pedData,
        pedValorTotal: Number(this.pedido.pedValorTotal),
        pedStatus: this.pedido.pedStatus || 'Pendente'
      };

      if (this.pedido.pedObservacoes && this.pedido.pedObservacoes.trim()) {
        pedidoParaEnviar.pedObservacoes = this.pedido.pedObservacoes.trim();
      }

      // Nota: O backend não tem método update ainda, então vamos apenas mostrar mensagem
      this.pedidoService.showMessage('Funcionalidade de atualização será implementada em breve.');
      this.router.navigate(['/fpedido']);
    }
  }

  cancel(): void {
    this.router.navigate(['/fpedido']);
  }
}
