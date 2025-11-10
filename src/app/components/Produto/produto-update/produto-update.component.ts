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
        // Normalizar proAtivo: backend pode retornar como String, converter para boolean para o checkbox
        if (typeof this.produto.proAtivo === 'string') {
          this.produto.proAtivo = this.produto.proAtivo.toLowerCase() === 'true';
        } else if (this.produto.proAtivo === undefined || this.produto.proAtivo === null) {
          this.produto.proAtivo = false;
        }
      });
    }
  }

  updateProduto(): void {
    if (this.produto.proId) {
      // Garantir que proAtivo seja boolean antes de enviar
      const produtoParaEnviar = {
        ...this.produto,
        proAtivo: Boolean(this.produto.proAtivo)
      };
      
      this.produtoService.update(produtoParaEnviar).subscribe(() => {
        this.produtoService.showMessage('Produto atualizado!');
        this.router.navigate(['/fproduto']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fproduto']);
  }
}
