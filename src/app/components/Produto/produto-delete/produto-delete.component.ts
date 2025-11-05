import { Component, OnInit } from '@angular/core';
import { Produto } from '../produto.module';
import { ProdutoService } from '../produto.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-produto-delete',
  templateUrl: './produto-delete.component.html',
  styleUrls: ['./produto-delete.component.css']
})
export class ProdutoDeleteComponent implements OnInit {

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

  deleteProduto(): void {
    if (this.produto.proId) {
      this.produtoService.delete(this.produto.proId).subscribe(() => {
        this.produtoService.showMessage('Produto excluído!');
        this.router.navigate(['/fproduto']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fproduto']);
  }
}
