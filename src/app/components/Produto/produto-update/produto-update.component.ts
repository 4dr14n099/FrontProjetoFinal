import { Component, OnInit } from '@angular/core';
import { Produto } from '../produto.module';
import { ProdutoService } from '../produto.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-produto-update',
  templateUrl: './produto-update.component.html',
  styleUrls: ['./produto-update.component.css']
})
export class ProdutoUpdateComponent implements OnInit {

  produto: Produto = {
    proNome: '',
    proAtivo: false
  }

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    const proId = this.route.snapshot.paramMap.get('proId');
    if (proId) {
      this.produtoService.readById(proId).subscribe(produto => {
        this.produto = produto;
      });
    }
  }

  updateProduto(): void {
    if (this.produto.proId) {
      this.produtoService.update(this.produto).subscribe(() => {
        this.produtoService.showMessage('Produto atualizado!');
        this.router.navigate(['/fproduto']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fproduto']);
  }
}
