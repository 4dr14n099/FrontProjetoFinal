import { Component, OnInit } from '@angular/core';
import { FormapagamentoService } from '../formapagamento.service';
import { FormaPagamento } from '../formapagamento.model';

@Component({
  selector: 'app-forma-pagamento-read',
  templateUrl: './forma-pagamento-read.component.html',
  styleUrls: ['./forma-pagamento-read.component.css']
})
export class FormaPagamentoReadComponent implements OnInit {

  formaPagamento: FormaPagamento[] = [];

  displayedColumns: string[] = [ 'formDescricao', 'formTipo',  'formAtivo', 'action'];

  constructor(private formapagamentoservice: FormapagamentoService) {}

  ngOnInit(): void {
    this.formapagamentoservice.read().subscribe(formaPagamento => {
      this.formaPagamento = formaPagamento;
    });
  }
}
