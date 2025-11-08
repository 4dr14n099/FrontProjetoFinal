import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cliente.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-cliente-read',
  templateUrl: './cliente-read.component.html',
  styleUrls: ['./cliente-read.component.css']
})
export class ClienteReadComponent implements OnInit, AfterViewInit {

  clientes: Cliente[] = [];
  dataSource = new MatTableDataSource<Cliente>([]);
  loading: boolean = false;
  searchTerm: string = '';

  // IMPORTANTE: RG está incluído aqui
  displayedColumns: string[] = [ 'cliNome', 'cliCpf',  'cliAtivo', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loading = true;
    this.clienteService.read().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.dataSource.data = clientes;
        // Filtro customizado
        this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
          const searchStr = filter.toLowerCase();
          const nome = (data.cliNome || '').toLowerCase();
          const cpf = this.formatarCPF(data.cliCpf).toLowerCase();
          const cpfLimpo = (data.cliCpf || '').replace(/\D/g, '');
          const id = data.cliId?.toString() || '';
          
          return nome.includes(searchStr) ||
                 cpf.includes(searchStr) ||
                 cpfLimpo.includes(searchStr) ||
                 id.includes(searchStr);
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.clienteService.showMessage('Erro ao carregar clientes!');
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.searchTerm;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Função para verificar se cliente está ativo
  // Backend retorna cliAtivo como String ("true" ou "false")
  isAtivoCliente(cliAtivo: string | boolean | undefined | null): boolean {
    if (cliAtivo === true) {
      return true;
    }
    if (typeof cliAtivo === 'string') {
      // Converte para minúscula para garantir comparação correta
      return cliAtivo.toLowerCase() === 'true';
    }
    return false;
  }

  // Formata CPF no formato 000.000.000-00
  formatarCPF(cpf: string | undefined): string {
    if (!cpf) {
      return '';
    }
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
      return cpf; // Retorna o CPF original se não tiver 11 dígitos
    }
    
    // Aplica a máscara 000.000.000-00
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
