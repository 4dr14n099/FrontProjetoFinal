export interface Pedido {
    id: number;
    cliente: Cliente;
    pecas: Peca[];
    formaDePagamento: FormaDePagamento;
    total: number; // Total do pedido
    dataPedido: Date;
  }
  
  export interface Cliente {
    id: number;
    nome: string;
    email: string;
    endereco: string;
    telefone: string;
  }
  
  export interface Peca {
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
  }
  
  export enum FormaDePagamento {
    CartaoCredito = 'Cartão de Crédito',
    Boleto = 'Boleto',
    Pix = 'Pix',
  }
  