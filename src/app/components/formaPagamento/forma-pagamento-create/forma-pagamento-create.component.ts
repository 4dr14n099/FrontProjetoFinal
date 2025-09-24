import { Component, OnInit } from '@angular/core';
import { FormapagamentoService } from '../formapagamento.service';
import { Router } from '@angular/router';
import { FormaPagamento } from '../formapagamento.model';

@Component({
  selector: 'app-forma-pagamento-create',
  templateUrl: './forma-pagamento-create.component.html',
  styleUrls: ['./forma-pagamento-create.component.css']
})
export class FormaPagamentoCreateComponent implements OnInit {

  
  formapagamento: FormaPagamento = {
    formDescricao: '',
    formTipo: '',
    formPermiteTroco: false,
    formAtivo: false
  }

  //importando productService
  constructor(private formapagamentoService: FormapagamentoService,
    private router: Router) { }
  
  ngOnInit(): void {    
  }

  createProduct(): void {
    this.formapagamentoService.create(this.formapagamento).subscribe(() => {
      this.formapagamentoService.showMessage('Forma de Pagamento criado!')
      this.router.navigate(['/formapagamento'])
    })
  }

  cancel(): void {
    this.router.navigate(['/formapagamento'])
  }  

}
