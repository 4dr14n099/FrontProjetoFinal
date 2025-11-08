import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Produto } from '../produto.module';
import { ProdutoService } from '../produto.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-produto-read',
  templateUrl: './produto-read.component.html',
  styleUrls: ['./produto-read.component.css']
})
export class ProdutoReadComponent implements OnInit, AfterViewInit {
  products!: Produto[]
  dataSource = new MatTableDataSource<Produto>([]);
  loading: boolean = false;
  searchTerm: string = '';
  displayedColumns = ['proId', 'proNome', 'proPrecoCusto', 'proPrecoVenda', 'action']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.loading = true;
    this.produtoService.read().subscribe({
      next: (produto) => {
        this.products = produto;
        this.dataSource.data = produto;
        // Filtro customizado
        this.dataSource.filterPredicate = (data: Produto, filter: string) => {
          const searchStr = filter.toLowerCase();
          const nome = (data.proNome || '').toLowerCase();
          const id = data.proId?.toString() || '';
          const precoCusto = data.proPrecoCusto?.toString() || '';
          const precoVenda = data.proPrecoVenda?.toString() || '';
          
          return nome.includes(searchStr) ||
                 id.includes(searchStr) ||
                 precoCusto.includes(searchStr) ||
                 precoVenda.includes(searchStr);
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.produtoService.showMessage('Erro ao carregar produtos!');
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
