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
      this.produtoService.readById(proId).subscribe({
        next: (produto) => {
          this.produto = produto;
          // Normalizar proAtivo: backend pode retornar como String, converter para boolean para o checkbox
          if (typeof this.produto.proAtivo === 'string') {
            this.produto.proAtivo = this.produto.proAtivo.toLowerCase().trim() === 'true';
          } else if (this.produto.proAtivo === undefined || this.produto.proAtivo === null) {
            this.produto.proAtivo = false;
          }
          // Garantir que seja boolean
          this.produto.proAtivo = Boolean(this.produto.proAtivo);
          
          // Formatar data de cadastro se existir
          if (this.produto.proDataCadastro) {
            // Se for string no formato yyyy-MM-dd, manter
            // Se for Date, converter para string
            if (this.produto.proDataCadastro instanceof Date) {
              const data = this.produto.proDataCadastro;
              const ano = data.getFullYear();
              const mes = String(data.getMonth() + 1).padStart(2, '0');
              const dia = String(data.getDate()).padStart(2, '0');
              this.produto.proDataCadastro = `${ano}-${mes}-${dia}`;
            }
          }
        },
        error: (error) => {
          console.error('Erro ao carregar produto:', error);
          this.produtoService.showMessage('Erro ao carregar produto!');
          this.router.navigate(['/fproduto']);
        }
      });
    }
  }

  updateProduto(): void {
    if (!this.produto.proId) {
      this.produtoService.showMessage('ID do produto não encontrado!');
      return;
    }

    // Validar nome (obrigatório)
    if (!this.produto.proNome || this.produto.proNome.trim() === '') {
      this.produtoService.showMessage('Nome do produto é obrigatório!');
      return;
    }

    // Preparar dados para envio ao backend
    // Garantir que proAtivo seja boolean
    const proAtivoValue = this.produto.proAtivo === true || 
                         this.produto.proAtivo === 'true' || 
                         String(this.produto.proAtivo).toLowerCase().trim() === 'true';
    
    const produtoParaEnviar: any = {
      proId: this.produto.proId,
      proNome: this.produto.proNome.trim(),
      proAtivo: proAtivoValue
    };

    // Data de cadastro - garantir formato yyyy-MM-dd
    if (this.produto.proDataCadastro) {
      let dataCadastroStr = String(this.produto.proDataCadastro);
      // Se já estiver no formato yyyy-MM-dd, usar direto
      if (dataCadastroStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        produtoParaEnviar.proDataCadastro = dataCadastroStr;
      } else {
        // Tentar converter de Date para string
        const data = new Date(dataCadastroStr);
        if (!isNaN(data.getTime())) {
          const ano = data.getFullYear();
          const mes = String(data.getMonth() + 1).padStart(2, '0');
          const dia = String(data.getDate()).padStart(2, '0');
          produtoParaEnviar.proDataCadastro = `${ano}-${mes}-${dia}`;
        } else {
          // Se não conseguir converter, manter o valor original ou usar data atual
          const hoje = new Date();
          const ano = hoje.getFullYear();
          const mes = String(hoje.getMonth() + 1).padStart(2, '0');
          const dia = String(hoje.getDate()).padStart(2, '0');
          produtoParaEnviar.proDataCadastro = `${ano}-${mes}-${dia}`;
        }
      }
    } else {
      // Se não tiver data de cadastro, usar data atual
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const dia = String(hoje.getDate()).padStart(2, '0');
      produtoParaEnviar.proDataCadastro = `${ano}-${mes}-${dia}`;
    }

    // Adicionar campos opcionais apenas se tiverem valor
    if (this.produto.proDescricao && this.produto.proDescricao.trim() !== '') {
      produtoParaEnviar.proDescricao = this.produto.proDescricao.trim();
    }

    if (this.produto.proCodigoBarras && this.produto.proCodigoBarras.trim() !== '') {
      produtoParaEnviar.proCodigoBarras = this.produto.proCodigoBarras.trim();
    }

    if (this.produto.proReferencia && this.produto.proReferencia.trim() !== '') {
      produtoParaEnviar.proReferencia = this.produto.proReferencia.trim();
    }

    if (this.produto.proUnidadeMedida && this.produto.proUnidadeMedida.trim() !== '') {
      produtoParaEnviar.proUnidadeMedida = this.produto.proUnidadeMedida.trim();
    }

    if (this.produto.proMarca && this.produto.proMarca.trim() !== '') {
      produtoParaEnviar.proMarca = this.produto.proMarca.trim();
    }

    if (this.produto.proCategoria && this.produto.proCategoria.trim() !== '') {
      produtoParaEnviar.proCategoria = this.produto.proCategoria.trim();
    }

    // Preços (converter para número, pode ser 0)
    if (this.produto.proPrecoCusto != null && this.produto.proPrecoCusto !== undefined) {
      produtoParaEnviar.proPrecoCusto = Number(this.produto.proPrecoCusto);
    }

    if (this.produto.proPrecoVenda != null && this.produto.proPrecoVenda !== undefined) {
      produtoParaEnviar.proPrecoVenda = Number(this.produto.proPrecoVenda);
    }

    // Estoque (converter para número inteiro)
    if (this.produto.proEstoqueAtual != null && this.produto.proEstoqueAtual !== undefined) {
      produtoParaEnviar.proEstoqueAtual = Number(this.produto.proEstoqueAtual);
    }

    if (this.produto.proEstoqueMinimo != null && this.produto.proEstoqueMinimo !== undefined) {
      produtoParaEnviar.proEstoqueMinimo = Number(this.produto.proEstoqueMinimo);
    }

    if (this.produto.proEstoqueMaximo != null && this.produto.proEstoqueMaximo !== undefined) {
      produtoParaEnviar.proEstoqueMaximo = Number(this.produto.proEstoqueMaximo);
    }

    if (this.produto.proLocalizacao && this.produto.proLocalizacao.trim() !== '') {
      produtoParaEnviar.proLocalizacao = this.produto.proLocalizacao.trim();
    }

    // Data de validade - se for texto livre, não enviar como data
    // Se for uma data válida no formato yyyy-MM-dd, enviar
    if (this.produto.proDataValidade) {
      const dataValidadeStr = String(this.produto.proDataValidade).trim();
      // Tentar parsear como data (formato yyyy-MM-dd)
      if (dataValidadeStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        produtoParaEnviar.proDataValidade = dataValidadeStr;
      }
      // Se for texto livre, não enviar (o backend espera LocalDate ou null)
    }

    if (this.produto.proObservacoes && this.produto.proObservacoes.trim() !== '') {
      produtoParaEnviar.proObservacoes = this.produto.proObservacoes.trim();
    }
    
    // Debug: log do que está sendo enviado
    console.log('Produto sendo enviado ao backend (update):', JSON.stringify(produtoParaEnviar, null, 2));
    
    // Enviar para o backend
    this.produtoService.update(produtoParaEnviar).subscribe({
      next: () => {
        this.produtoService.showMessage('Produto atualizado!');
        this.router.navigate(['/fproduto']);
      },
      error: (error) => {
        console.error('Erro ao atualizar produto:', error);
        let errorMessage = 'Erro ao atualizar produto!';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.produtoService.showMessage(errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fproduto']);
  }
}
