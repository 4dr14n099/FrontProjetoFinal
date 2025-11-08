import { Component, OnInit } from '@angular/core';
import { Pedido } from '../pedido.model';
import { PedidoService } from '../pedido.service';
import { ClienteService } from '../../Cliente/cliente.service';
import { Cliente } from '../../Cliente/cliente.model';
import { ProdutoService } from '../../Produto/produto.service';
import { Produto } from '../../Produto/produto.module';
import { FormapagamentoService } from '../../formaPagamento/formapagamento.service';
import { FormaPagamento } from '../../formaPagamento/formapagamento.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-create',
  templateUrl: './pedido-create.component.html',
  styleUrls: ['./pedido-create.component.css']
})
export class PedidoCreateComponent implements OnInit {

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarProdutos();
    this.carregarFormasPagamento();
    // Define data padrão como hoje
    if (!this.pedido.pedData) {
      this.pedido.pedData = new Date().toISOString().split('T')[0];
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

  createPedido(): void {
    // Validações
    if (!this.pedido.cliente || !this.pedido.cliente.cliId) {
      this.pedidoService.showMessage('Selecione um cliente!');
      return;
    }
    
    if (!this.pedido.pedValorTotal || this.pedido.pedValorTotal <= 0) {
      this.pedidoService.showMessage('Informe um valor total válido (maior que zero)!');
      return;
    }

    // Garantir que a data do pedido está preenchida
    if (!this.pedido.pedData) {
      this.pedido.pedData = new Date().toISOString().split('T')[0];
    }

    // Preparar dados para envio conforme estrutura do backend
    // O backend espera receber o cliente e forma de pagamento como referência (apenas com ID)
    const pedidoParaEnviar: any = {
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

    this.pedidoService.create(pedidoParaEnviar).subscribe({
      next: (response) => {
        this.pedidoService.showMessage('Pedido criado com sucesso!');
        this.router.navigate(['/fpedido']);
      },
      error: (error) => {
        console.error('Erro ao criar pedido:', error);
        let errorMessage = 'Erro desconhecido ao salvar pedido';
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
