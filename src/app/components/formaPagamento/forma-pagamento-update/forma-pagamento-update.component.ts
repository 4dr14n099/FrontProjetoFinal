import { Component, OnInit } from '@angular/core';
import { FormaPagamento } from '../formapagamento.model';
import { FormapagamentoService } from '../formapagamento.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forma-pagamento-update',
  templateUrl: './forma-pagamento-update.component.html',
  styleUrls: ['./forma-pagamento-update.component.css']
})
export class FormaPagamentoUpdateComponent implements OnInit {

  formapagamento: FormaPagamento = {
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

  updateFormaPagamento(): void {
    if (this.formapagamento.formId) {
      this.formapagamentoService.update(this.formapagamento).subscribe(() => {
        this.formapagamentoService.showMessage('Forma de Pagamento atualizada!');
        this.router.navigate(['/fpagamentos']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fpagamentos']);
  }
}
