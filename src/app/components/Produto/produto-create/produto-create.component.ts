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
    proAtivo: false
  }

  //importando productService
  constructor(private produtoService: ProdutoService,
    private router: Router) { }
  
  ngOnInit(): void {    
  }

  createProduct(): void {
    this.produtoService.create(this.produto).subscribe(() => {
      this.produtoService.showMessage('Produto criado!')
      this.router.navigate(['//produto'])
    })
  }

  cancel(): void {
    this.router.navigate(['/fproduto'])
  }  

}