export interface Produto {
  proId?: number;
  proNome: string;
  proDescricao?: string;
  proCodigoBarras?: string;
  proReferencia?: string;
  proUnidadeMedida?: string;
  proMarca?: string;
  proCategoria?: string;
  proPrecoCusto?: number;
  proPrecoVenda?: number;
  proEstoqueAtual?: number;
  proEstoqueMinimo?: number;
  proEstoqueMaximo?: number;
  proLocalizacao?: string;
  proDataValidade?: string | Date;
  proDataCadastro?: string | Date;
  proObservacoes?: string;
  proAtivo: boolean | string;

}