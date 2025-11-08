import { Component, OnInit } from '@angular/core';
import { Pedido } from '../pedido.model';
import { PedidoService } from '../pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pedido-delete',
  templateUrl: './pedido-delete.component.html',
  styleUrls: ['./pedido-delete.component.css']
})
export class PedidoDeleteComponent implements OnInit {

  pedido: Pedido = {
    cliente: {} as any,
    pedValorTotal: 0,
    pedStatus: ''
  }
  loading: boolean = false;

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const pedId = this.route.snapshot.paramMap.get('pedId');
    if (pedId) {
      this.pedidoService.readById(pedId).subscribe({
        next: (pedido) => {
          this.pedido = pedido;
          this.loading = false;
        },
        error: (error) => {
          this.pedidoService.showMessage('Erro ao carregar pedido!');
          this.loading = false;
          this.router.navigate(['/fpedido']);
        }
      });
    }
  }

  deletePedido(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o pedido #${this.pedido.pedId}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.pedido.pedId) {
        this.loading = true;
        this.pedidoService.delete(this.pedido.pedId).subscribe({
          next: () => {
            this.pedidoService.showMessage('Pedido excluído com sucesso!');
            this.router.navigate(['/fpedido']);
          },
          error: (error) => {
            this.pedidoService.showMessage('Erro ao excluir pedido!');
            this.loading = false;
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fpedido']);
  }
}
