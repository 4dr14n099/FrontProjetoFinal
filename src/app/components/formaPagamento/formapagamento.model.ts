export interface FormaPagamento {
  formId?: number;
  formDescricao?: string;
  formTipo: string;
  formNumeroParcelas?: number;
  formDiasEntreParcelas?: number;
  formPermiteTroco: boolean;
  formTaxaPercentual?: number;
  formAtivo: boolean;
}