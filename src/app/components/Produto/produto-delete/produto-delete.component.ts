import { Component, OnInit } from '@angular/core';
import { Produto } from '../produto.module';
import { ProdutoService } from '../produto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-produto-delete',
  templateUrl: './produto-delete.component.html',
  styleUrls: ['./produto-delete.component.css']
})
export class ProdutoDeleteComponent implements OnInit {

  produto: Produto = {
    proNome: '',
    proAtivo: false
  }
  loading: boolean = false;

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const proId = this.route.snapshot.paramMap.get('proId');
    if (proId) {
      this.produtoService.readById(proId).subscribe({
        next: (produto) => {
          this.produto = produto;
          this.loading = false;
        },
        error: (error) => {
          this.produtoService.showMessage('Erro ao carregar produto!');
          this.loading = false;
          this.router.navigate(['/fproduto']);
        }
      });
    }
  }

  deleteProduto(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o produto ${this.produto.proNome}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.produto.proId) {
        this.loading = true;
        this.produtoService.delete(this.produto.proId).subscribe({
          next: () => {
            this.produtoService.showMessage('Produto excluído com sucesso!');
            this.router.navigate(['/fproduto']);
          },
          error: (error) => {
            this.produtoService.showMessage('Erro ao excluir produto!');
            this.loading = false;
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fproduto']);
  }
}
