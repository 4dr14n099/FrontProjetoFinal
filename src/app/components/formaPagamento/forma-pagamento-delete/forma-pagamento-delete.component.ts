import { Component, OnInit } from '@angular/core';
import { FormaPagamento } from '../formapagamento.model';
import { FormapagamentoService } from '../formapagamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-forma-pagamento-delete',
  templateUrl: './forma-pagamento-delete.component.html',
  styleUrls: ['./forma-pagamento-delete.component.css']
})
export class FormaPagamentoDeleteComponent implements OnInit {

  formapagamento: FormaPagamento = {
    formDescricao: '',
    formTipo: '',
    formPermiteTroco: false,
    formAtivo: false
  }
  loading: boolean = false;

  constructor(
    private formapagamentoService: FormapagamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const formId = this.route.snapshot.paramMap.get('formId');
    if (formId) {
      this.formapagamentoService.readById(formId).subscribe({
        next: (formapagamento) => {
          this.formapagamento = formapagamento;
          this.loading = false;
        },
        error: (error) => {
          this.formapagamentoService.showMessage('Erro ao carregar forma de pagamento!');
          this.loading = false;
          this.router.navigate(['/fpagamentos']);
        }
      });
    }
  }

  deleteFormaPagamento(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir a forma de pagamento ${this.formapagamento.formDescricao}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.formapagamento.formId) {
        this.loading = true;
        this.formapagamentoService.delete(this.formapagamento.formId).subscribe({
          next: () => {
            this.formapagamentoService.showMessage('Forma de Pagamento excluída com sucesso!');
            this.router.navigate(['/fpagamentos']);
          },
          error: (error) => {
            this.formapagamentoService.showMessage('Erro ao excluir forma de pagamento!');
            this.loading = false;
          }
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fpagamentos']);
  }
}
