import { Cliente } from '../Cliente/cliente.model';
import { FormaPagamento } from '../formaPagamento/formapagamento.model';

export interface Pedido {
  pedId?: number;
  cliente?: Cliente | any; // O backend pode não retornar o cliente completo devido ao @JsonIgnore
  cliId?: number; // ID do cliente que pode vir separado
  formaPagamento?: FormaPagamento | any; // Forma de pagamento do pedido
  formId?: number; // ID da forma de pagamento que pode vir separado
  pedData?: string; // formato "yyyy-MM-dd" - backend usa Date
  pedValorTotal: number; // Double no backend
  pedStatus: string; // Ex: "Pendente", "Confirmado", "Cancelado", "Entregue"
  pedObservacoes?: string;
}

