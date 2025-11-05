import { Component, OnInit } from '@angular/core';
import { FormaPagamento } from '../formapagamento.model';
import { FormapagamentoService } from '../formapagamento.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(
    private formapagamentoService: FormapagamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const formId = this.route.snapshot.paramMap.get('formId');
    if (formId) {
      this.formapagamentoService.readById(formId).subscribe(formapagamento => {
        this.formapagamento = formapagamento;
      });
    }
  }

  deleteFormaPagamento(): void {
    if (this.formapagamento.formId) {
      this.formapagamentoService.delete(this.formapagamento.formId).subscribe(() => {
        this.formapagamentoService.showMessage('Forma de Pagamento excluída!');
        this.router.navigate(['/fpagamentos']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fpagamentos']);
  }
}
