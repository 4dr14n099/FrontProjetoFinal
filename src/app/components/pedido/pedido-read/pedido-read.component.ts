import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../pedido.model';
import { ClienteService } from '../../Cliente/cliente.service';
import { Cliente } from '../../Cliente/cliente.model';
import { FormapagamentoService } from '../../formaPagamento/formapagamento.service';
import { FormaPagamento } from '../../formaPagamento/formapagamento.model';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-pedido-read',
  templateUrl: './pedido-read.component.html',
  styleUrls: ['./pedido-read.component.css']
})
export class PedidoReadComponent implements OnInit, AfterViewInit {

  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];
  formasPagamento: FormaPagamento[] = [];
  displayedColumns = ['pedId', 'cliente', 'formaPagamento', 'pedData', 'pedValorTotal', 'pedStatus', 'action'];
  dataSource = new MatTableDataSource<Pedido>([]);
  loading: boolean = false;
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private formapagamentoService: FormapagamentoService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    // Busca pedidos, clientes e formas de pagamento simultaneamente
    forkJoin({
      pedidos: this.pedidoService.read(),
      clientes: this.clienteService.read(),
      formasPagamento: this.formapagamentoService.read()
    }).subscribe({
      next: ({ pedidos, clientes, formasPagamento }) => {
        this.clientes = clientes;
        this.formasPagamento = formasPagamento;
        
        // Processa cada pedido para encontrar o cliente e forma de pagamento correspondentes
        this.pedidos = pedidos.map((pedido: any) => {
          // Tenta encontrar o ID do cliente de várias formas possíveis
          let clienteId: number | null = null;
          
          // 1. Verifica se tem cliId diretamente no pedido
          if (pedido.cliId) {
            clienteId = pedido.cliId;
          }
          // 2. Verifica se tem clienteId no pedido
          else if (pedido.clienteId) {
            clienteId = pedido.clienteId;
          }
          // 3. Verifica se o objeto cliente tem ID
          else if (pedido.cliente) {
            if (typeof pedido.cliente === 'object') {
              clienteId = pedido.cliente.cliId || pedido.cliente.clienteId || pedido.cliente.id;
            } else if (typeof pedido.cliente === 'number') {
              clienteId = pedido.cliente;
            }
          }
          
          // Se encontrou o ID, busca o cliente completo
          if (clienteId && this.clientes.length > 0) {
            const clienteEncontrado = this.clientes.find(c => c.cliId === clienteId);
            if (clienteEncontrado) {
              pedido.cliente = clienteEncontrado;
            }
          }

          // Tenta encontrar o ID da forma de pagamento de várias formas possíveis
          let formaPagamentoId: number | null = null;
          
          // 1. Verifica se tem formId diretamente no pedido
          if (pedido.formId) {
            formaPagamentoId = pedido.formId;
          }
          // 2. Verifica se tem formaPagamentoId no pedido
          else if (pedido.formaPagamentoId) {
            formaPagamentoId = pedido.formaPagamentoId;
          }
          // 3. Verifica se o objeto formaPagamento tem ID
          else if (pedido.formaPagamento) {
            if (typeof pedido.formaPagamento === 'object') {
              formaPagamentoId = pedido.formaPagamento.formId || pedido.formaPagamento.formaPagamentoId || pedido.formaPagamento.id;
            } else if (typeof pedido.formaPagamento === 'number') {
              formaPagamentoId = pedido.formaPagamento;
            }
          }
          
          // Se encontrou o ID, busca a forma de pagamento completa
          if (formaPagamentoId && this.formasPagamento.length > 0) {
            const formaPagamentoEncontrada = this.formasPagamento.find(f => f.formId === formaPagamentoId);
            if (formaPagamentoEncontrada) {
              pedido.formaPagamento = formaPagamentoEncontrada;
            }
          }
          
          return pedido;
        });
        this.dataSource.data = this.pedidos;
        // Filtro customizado para buscar em todos os campos
        this.dataSource.filterPredicate = (data: Pedido, filter: string) => {
          const searchStr = filter.toLowerCase();
          const clienteNome = this.getClienteNome(data).toLowerCase();
          const formaPagamentoDesc = this.getFormaPagamentoDesc(data).toLowerCase();
          const pedId = data.pedId?.toString() || '';
          const pedStatus = (data.pedStatus || '').toLowerCase();
          const pedValorTotal = data.pedValorTotal?.toString() || '';
          const pedData = data.pedData ? new Date(data.pedData).toLocaleDateString('pt-BR') : '';
          
          return clienteNome.includes(searchStr) ||
                 formaPagamentoDesc.includes(searchStr) ||
                 pedId.includes(searchStr) ||
                 pedStatus.includes(searchStr) ||
                 pedValorTotal.includes(searchStr) ||
                 pedData.includes(searchStr);
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.pedidoService.showMessage('Erro ao carregar pedidos!');
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.searchTerm;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
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

  getFormaPagamentoDesc(pedido: any): string {
    // Se a forma de pagamento já está completa e tem descrição
    if (pedido.formaPagamento && pedido.formaPagamento.formDescricao) {
      return pedido.formaPagamento.formDescricao;
    }
    
    // Tenta buscar pelo ID da forma de pagamento
    let formaPagamentoId: number | null = null;
    
    if (pedido.formId) {
      formaPagamentoId = pedido.formId;
    } else if (pedido.formaPagamentoId) {
      formaPagamentoId = pedido.formaPagamentoId;
    } else if (pedido.formaPagamento) {
      if (typeof pedido.formaPagamento === 'object') {
        formaPagamentoId = pedido.formaPagamento.formId || pedido.formaPagamento.formaPagamentoId || pedido.formaPagamento.id;
      } else if (typeof pedido.formaPagamento === 'number') {
        formaPagamentoId = pedido.formaPagamento;
      }
    }
    
    if (formaPagamentoId && this.formasPagamento.length > 0) {
      const formaPagamento = this.formasPagamento.find(f => f.formId === formaPagamentoId);
      if (formaPagamento && formaPagamento.formDescricao) {
        return formaPagamento.formDescricao;
      }
    }
    
    return 'N/A';
  }
}
