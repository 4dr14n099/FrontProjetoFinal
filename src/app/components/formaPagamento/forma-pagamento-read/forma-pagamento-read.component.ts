import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormapagamentoService } from '../formapagamento.service';
import { FormaPagamento } from '../formapagamento.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-forma-pagamento-read',
  templateUrl: './forma-pagamento-read.component.html',
  styleUrls: ['./forma-pagamento-read.component.css']
})
export class FormaPagamentoReadComponent implements OnInit, AfterViewInit {

  formaPagamento: FormaPagamento[] = [];
  dataSource = new MatTableDataSource<FormaPagamento>([]);
  loading: boolean = false;
  searchTerm: string = '';

  displayedColumns: string[] = [ 'formDescricao', 'formTipo',  'formAtivo', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formapagamentoservice: FormapagamentoService) {}

  ngOnInit(): void {
    this.loading = true;
    this.formapagamentoservice.read().subscribe({
      next: (formaPagamento) => {
        this.formaPagamento = formaPagamento;
        this.dataSource.data = formaPagamento;
        // Filtro customizado
        this.dataSource.filterPredicate = (data: FormaPagamento, filter: string) => {
          const searchStr = filter.toLowerCase();
          const descricao = (data.formDescricao || '').toLowerCase();
          const tipo = (data.formTipo || '').toLowerCase();
          const id = data.formId?.toString() || '';
          
          return descricao.includes(searchStr) ||
                 tipo.includes(searchStr) ||
                 id.includes(searchStr);
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.formapagamentoservice.showMessage('Erro ao carregar formas de pagamento!');
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
}
