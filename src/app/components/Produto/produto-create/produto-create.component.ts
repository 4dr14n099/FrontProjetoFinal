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
    // Validar nome (obrigatório)
    if (!this.produto.proNome || this.produto.proNome.trim() === '') {
      this.produtoService.showMessage('Nome do produto é obrigatório!');
      return;
    }

    // Validar estoque atual não pode ser maior que estoque máximo
    if (this.produto.proEstoqueAtual != null && this.produto.proEstoqueMaximo != null) {
      if (Number(this.produto.proEstoqueAtual) > Number(this.produto.proEstoqueMaximo)) {
        this.produtoService.showMessage('O estoque atual não pode ser maior que o estoque máximo!');
        return;
      }
    }

    // Preparar dados para envio ao backend
    // IMPORTANTE: Não incluir proId no create (deve ser gerado pelo backend)
    // Garantir que proAtivo seja boolean
    const proAtivoValue = this.produto.proAtivo === true || 
                         this.produto.proAtivo === 'true' || 
                         String(this.produto.proAtivo).toLowerCase().trim() === 'true';
    
    const produtoParaEnviar: any = {
      proNome: this.produto.proNome.trim(),
      proAtivo: proAtivoValue
    };

    // Data de cadastro - sempre enviar (obrigatório)
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
          // Se não conseguir converter, usar data atual
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

    // Estoque (converter para número inteiro ou null)
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

    // Data de validade - converter de dd/mm/aaaa para yyyy-MM-dd
    if (this.produto.proDataValidade) {
      const dataValidadeStr = String(this.produto.proDataValidade).trim();
      
      // Se já estiver no formato yyyy-MM-dd, usar direto
      if (dataValidadeStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        produtoParaEnviar.proDataValidade = dataValidadeStr;
      }
      // Se estiver no formato dd/mm/aaaa, converter para yyyy-MM-dd
      else if (dataValidadeStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const partes = dataValidadeStr.split('/');
        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];
        produtoParaEnviar.proDataValidade = `${ano}-${mes}-${dia}`;
      }
      // Se for texto livre, não enviar (o backend espera LocalDate ou null)
    }


    if (this.produto.proObservacoes && this.produto.proObservacoes.trim() !== '') {
      produtoParaEnviar.proObservacoes = this.produto.proObservacoes.trim();
    }
    
    // Debug: log do que está sendo enviado
    console.log('Produto sendo enviado ao backend:', JSON.stringify(produtoParaEnviar, null, 2));
    
    // Enviar para o backend
    this.produtoService.create(produtoParaEnviar).subscribe({
      next: () => {
        this.produtoService.showMessage('Produto criado!');
        this.router.navigate(['/fproduto']);
      },
      error: (error) => {
        console.error('Erro ao criar produto:', error);
        let errorMessage = 'Erro ao criar produto!';
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
    this.router.navigate(['/fproduto'])
  }

  formatarDataValidadeInput(value: string): void {
    // Se o valor já estiver formatado com barras, remove as barras primeiro
    let apenasNumeros = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    if (apenasNumeros.length > 8) {
      apenasNumeros = apenasNumeros.substring(0, 8);
    }
    
    // Formata como dd/mm/aaaa
    let valorFormatado = apenasNumeros;
    if (apenasNumeros.length > 2) {
      valorFormatado = apenasNumeros.substring(0, 2) + '/' + apenasNumeros.substring(2);
    }
    if (apenasNumeros.length > 4) {
      valorFormatado = apenasNumeros.substring(0, 2) + '/' + apenasNumeros.substring(2, 4) + '/' + apenasNumeros.substring(4);
    }
    
    // Atualiza o modelo
    this.produto.proDataValidade = valorFormatado;
  }

  validarEstoque(): void {
    if (this.produto.proEstoqueAtual != null && this.produto.proEstoqueMaximo != null) {
      if (Number(this.produto.proEstoqueAtual) > Number(this.produto.proEstoqueMaximo)) {
        // Se for maior, ajustar para o máximo
        this.produto.proEstoqueAtual = this.produto.proEstoqueMaximo;
      }
    }
  }

}