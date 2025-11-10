import { Component, OnInit } from '@angular/core';
import { Produto } from '../produto.module';
import { ProdutoService } from '../produto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produto-create',
  templateUrl: './produto-create.component.html',
  styleUrls: ['./produto-create.component.css']
})
export class ProdutoCreateComponent implements OnInit {

  produto: Produto = {
    proNome: '',
    proAtivo: true
  }

  //importando productService
  constructor(private produtoService: ProdutoService,
    private router: Router) { }
  
  ngOnInit(): void {
    // Definir data de cadastro automaticamente como data atual
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    this.produto.proDataCadastro = `${ano}-${mes}-${dia}`;
  }

  createProduct(): void {
    // Garantir que proAtivo seja boolean antes de enviar
    const produtoParaEnviar = {
      ...this.produto,
      proAtivo: Boolean(this.produto.proAtivo)
    };
    
    this.produtoService.create(produtoParaEnviar).subscribe(() => {
      this.produtoService.showMessage('Produto criado!')
      this.router.navigate(['/fproduto'])
    })
  }

  cancel(): void {
    this.router.navigate(['/fproduto'])
  }  

}