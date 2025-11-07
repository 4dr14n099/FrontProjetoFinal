import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent implements OnInit {

  cliente: Cliente = {
    cliNome: '',
    cliCpf: '',
    cliDataNascimento: '',
    cliSexo: ''
  }

  cpfError: string = '';
  enderecoError: string = '';
  dataNascimentoError: string = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    const cliId = this.route.snapshot.paramMap.get('cliId');
    if (cliId) {
      this.clienteService.readById(cliId).subscribe(cliente => {
        this.cliente = cliente;
        // Formatar CPF se vier sem máscara
        if (this.cliente.cliCpf && !this.cliente.cliCpf.includes('.')) {
          this.formatarCPFExistente();
        }
        // Formatar data de nascimento se vier do backend no formato yyyy-mm-dd
        if (this.cliente.cliDataNascimento && this.cliente.cliDataNascimento.includes('-')) {
          this.cliente.cliDataNascimento = this.converterDataDoBackend(this.cliente.cliDataNascimento);
        }
      });
    }
  }

  // Formata CPF existente ao carregar
  formatarCPFExistente(): void {
    if (this.cliente.cliCpf) {
      let cpf = this.cliente.cliCpf.replace(/\D/g, '');
      if (cpf.length === 11) {
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.cliente.cliCpf = cpf;
      }
    }
  }

  // Validação de CPF brasileiro
  validarCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    // Valida primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) {
      return false;
    }

    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) {
      return false;
    }

    return true;
  }

  // Formata CPF com máscara
  formatarCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.cliente.cliCpf = value;
      this.cpfError = '';
    }
  }

  // Valida CPF ao sair do campo
  validarCPFCampo(): void {
    const cpfLimpo = this.cliente.cliCpf.replace(/[^\d]/g, '');
    if (cpfLimpo.length > 0 && cpfLimpo.length !== 11) {
      this.cpfError = 'CPF deve ter 11 dígitos';
    } else if (cpfLimpo.length === 11 && !this.validarCPF(this.cliente.cliCpf)) {
      this.cpfError = 'CPF inválido';
    } else {
      this.cpfError = '';
    }
  }

  // Formata data de nascimento com máscara dd/mm/aaaa
  formatarDataNascimento(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    // Aplica máscara progressivamente
    let formatted = value;
    if (value.length > 2) {
      formatted = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 4) {
      formatted = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4);
    }
    
    this.cliente.cliDataNascimento = formatted;
    this.dataNascimentoError = '';
  }

  // Converte data dd/mm/aaaa para yyyy-mm-dd
  converterDataParaBackend(dataFormatada: string): string {
    if (!dataFormatada || dataFormatada.length !== 10) {
      return '';
    }
    
    const partes = dataFormatada.split('/');
    if (partes.length !== 3) {
      return '';
    }
    
    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];
    
    return `${ano}-${mes}-${dia}`;
  }

  // Converte data yyyy-mm-dd para dd/mm/aaaa
  converterDataDoBackend(dataBackend: string): string {
    if (!dataBackend || !dataBackend.includes('-')) {
      return '';
    }
    
    const partes = dataBackend.split('-');
    if (partes.length !== 3) {
      return '';
    }
    
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Valida data de nascimento ao sair do campo (apenas formato)
  validarDataNascimentoCampo(): void {
    const data = this.cliente.cliDataNascimento || '';
    
    if (!data || data.length !== 10) {
      this.dataNascimentoError = 'Data de nascimento inválida (dd/mm/aaaa)';
      return;
    }

    this.dataNascimentoError = '';
  }

  // Validação de endereço
  validarEndereco(): void {
    const endProprietario = this.cliente.endProprietario || '';
    const enderecos = this.cliente.enderecos || '';

    if (!endProprietario.trim() && !enderecos) {
      this.enderecoError = 'Informe pelo menos um endereço';
      return;
    }

    if (endProprietario.trim() && endProprietario.trim().length < 5) {
      this.enderecoError = 'Endereço deve ter pelo menos 5 caracteres';
      return;
    }

    if (typeof enderecos === 'string' && enderecos.trim() && enderecos.trim().length < 5) {
      this.enderecoError = 'Endereço deve ter pelo menos 5 caracteres';
      return;
    }

    this.enderecoError = '';
  }

  updateCliente(): void {
    if (!this.cliente.cliId) {
      return;
    }

    // Limpar mensagens de erro anteriores
    this.cpfError = '';
    this.enderecoError = '';
    this.dataNascimentoError = '';

    // Validar CPF
    const cpfLimpo = this.cliente.cliCpf.replace(/[^\d]/g, '');
    if (!cpfLimpo || cpfLimpo.length !== 11) {
      this.cpfError = 'CPF deve ter 11 dígitos';
      this.clienteService.showMessage('CPF inválido!');
      return;
    }

    if (!this.validarCPF(this.cliente.cliCpf)) {
      this.cpfError = 'CPF inválido';
      this.clienteService.showMessage('CPF inválido! Verifique os dígitos.');
      return;
    }

    // Validar formato da data de nascimento
    if (!this.cliente.cliDataNascimento || this.cliente.cliDataNascimento.length !== 10) {
      this.dataNascimentoError = 'Data de nascimento inválida (dd/mm/aaaa)';
      this.clienteService.showMessage('Data de nascimento inválida!');
      return;
    }

    // Validar endereço
    this.validarEndereco();
    if (this.enderecoError) {
      this.clienteService.showMessage(this.enderecoError);
      return;
    }

    // Converter data de nascimento para formato do backend (yyyy-mm-dd)
    const dataNascimentoBackend = this.converterDataParaBackend(this.cliente.cliDataNascimento);

    // Salvar CPF apenas com números e data no formato do backend
    const clienteParaEnviar = {
      ...this.cliente,
      cliCpf: cpfLimpo,
      cliDataNascimento: dataNascimentoBackend
    };

    this.clienteService.update(clienteParaEnviar).subscribe(() => {
      this.clienteService.showMessage('Cliente atualizado!');
      this.router.navigate(['/fcliente']);
    });
  }

  cancel(): void {
    this.router.navigate(['/fcliente']);
  }
}
