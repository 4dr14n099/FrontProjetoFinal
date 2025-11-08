import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

  cliente: Cliente = {
    cliNome: '',
    cliCpf: '',
    cliDataNascimento: '',
    cliSexo: ''
  }
  loading: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const cliId = this.route.snapshot.paramMap.get('cliId');
    if (cliId) {
      this.clienteService.readById(cliId).subscribe({
        next: (cliente) => {
          this.cliente = cliente;
          this.loading = false;
        },
        error: (error) => {
          this.clienteService.showMessage('Erro ao carregar cliente!');
          this.loading = false;
          this.router.navigate(['/fcliente']);
        }
      });
    }
  }

  deleteCliente(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o cliente ${this.cliente.cliNome}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.cliente.cliId) {
        this.loading = true;
        this.clienteService.delete(this.cliente.cliId).subscribe({
          next: () => {
            this.clienteService.showMessage('Cliente excluído com sucesso!');
            this.router.navigate(['/fcliente']);
          },
          error: (error) => {
            this.clienteService.showMessage('Erro ao excluir cliente!');
            this.loading = false;
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fcliente']);
  }
}
