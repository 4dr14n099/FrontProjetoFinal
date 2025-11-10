import { Component, OnInit } from '@angular/core';
import { Pedido } from '../pedido.model';
import { PedidoService } from '../pedido.service';
import { ClienteService } from '../../Cliente/cliente.service';
import { Cliente } from '../../Cliente/cliente.model';
import { ProdutoService } from '../../Produto/produto.service';
import { Produto } from '../../Produto/produto.module';
import { FormapagamentoService } from '../../formaPagamento/formapagamento.service';
import { FormaPagamento } from '../../formaPagamento/formapagamento.model';
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
  produtos: Produto[] = [];
  formasPagamento: FormaPagamento[] = [];
  produtoSelecionado: Produto | null = null;

  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private formapagamentoService: FormapagamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarFormasPagamento();
    const pedId = this.route.snapshot.paramMap.get('pedId');
    if (pedId) {
      // Carregar pedido, clientes e formas de pagamento simultaneamente
      forkJoin({
        pedido: this.pedidoService.readById(pedId),
        clientes: this.clienteService.read(),
        formasPagamento: this.formapagamentoService.read()
      }).subscribe(({ pedido, clientes, formasPagamento }) => {
        // Filtrar apenas formas de pagamento ativas
        this.formasPagamento = formasPagamento.filter(fp => {
          const ativo = fp.formAtivo;
          if (ativo === true) return true;
          if (typeof ativo === 'string') {
            return (ativo as string).toLowerCase() === 'true';
          }
          return false;
        });
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

        // Tratar a forma de pagamento - pode vir como objeto completo, apenas ID ou referência
        let formaPagamentoId: number | null = null;
        
        if (pedido.formId) {
          formaPagamentoId = pedido.formId;
        } else if (pedido.formaPagamento) {
          if (typeof pedido.formaPagamento === 'object' && pedido.formaPagamento.formId) {
            formaPagamentoId = pedido.formaPagamento.formId;
          } else if (typeof pedido.formaPagamento === 'number') {
            formaPagamentoId = pedido.formaPagamento;
          }
        }

        // Se encontrou o ID, buscar a forma de pagamento completa na lista
        if (formaPagamentoId && this.formasPagamento.length > 0) {
          const formaPagamentoEncontrada = this.formasPagamento.find(f => f.formId === formaPagamentoId);
          if (formaPagamentoEncontrada) {
            this.pedido.formaPagamento = formaPagamentoEncontrada;
          } else {
            // Se não encontrou, criar um objeto mínimo com o ID
            this.pedido.formaPagamento = { formId: formaPagamentoId } as FormaPagamento;
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

  carregarProdutos(): void {
    this.produtoService.read().subscribe(produtos => {
      this.produtos = produtos;
    });
  }

  carregarFormasPagamento(): void {
    this.formapagamentoService.read().subscribe(formasPagamento => {
      // Filtrar apenas formas de pagamento ativas
      this.formasPagamento = formasPagamento.filter(fp => {
        const ativo = fp.formAtivo;
        if (ativo === true) return true;
        if (typeof ativo === 'string') {
          return (ativo as string).toLowerCase() === 'true';
        }
        return false;
      });
    });
  }

  onProdutoSelecionado(): void {
    if (this.produtoSelecionado && this.produtoSelecionado.proPrecoVenda) {
      this.pedido.pedValorTotal = this.produtoSelecionado.proPrecoVenda;
    } else {
      this.pedido.pedValorTotal = 0;
    }
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

    // Adicionar forma de pagamento se selecionada
    if (this.pedido.formaPagamento && this.pedido.formaPagamento.formId) {
      pedidoParaEnviar.formaPagamento = {
        formId: this.pedido.formaPagamento.formId
      };
    }

    // Adicionar campo opcional apenas se existir
    if (this.pedido.pedObservacoes && this.pedido.pedObservacoes.trim()) {
      pedidoParaEnviar.pedObservacoes = this.pedido.pedObservacoes.trim();
    }

    this.pedidoService.update(pedidoParaEnviar).subscribe({
      next: () => {
        this.pedidoService.showMessage('Pedido atualizado com sucesso!');
        this.router.navigate(['/fpedido']);
      },
      error: (error) => {
        let errorMessage = 'Erro ao atualizar pedido!';
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.pedidoService.showMessage(errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fpedido']);
  }
}
