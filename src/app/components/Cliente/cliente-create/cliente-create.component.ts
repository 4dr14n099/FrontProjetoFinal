import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {


  cliente: Cliente = {
    cliNome: '',
    cliCpf: '',
    cliDataNascimento: '',
    cliSexo: '',
    cliAtivo: true
  }

  cpfError: string = '';
  enderecoError: string = '';
  dataNascimentoError: string = '';
  cepError: string = '';

  // Dados do endereço
  cep: string = '';
  endereco: any = {
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
    numero: ''
  };

  buscandoCEP: boolean = false;
  ultimoCepBuscado: string = '';

  //importando productService
  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private http: HttpClient
  ) { }
  
  ngOnInit(): void {
    // Definir data de cadastro automaticamente como data atual
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    this.cliente.cliDataCadastro = `${ano}-${mes}-${dia}`;
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

  // Valida se é maior de idade (18 anos)
  validarMaiorIdade(dataNascimento: string): boolean {
    if (!dataNascimento || dataNascimento.length !== 10) {
      return false;
    }

    const partes = dataNascimento.split('/');
    if (partes.length !== 3) {
      return false;
    }

    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Mês começa em 0 no JavaScript
    const ano = parseInt(partes[2]);

    // Validar se a data é válida
    const data = new Date(ano, mes, dia);
    if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
      return false;
    }

    // Calcular idade
    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();

    // Ajustar idade se ainda não fez aniversário este ano
    if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) {
      idade--;
    }

    return idade >= 18;
  }

  // Valida data de nascimento ao sair do campo
  validarDataNascimentoCampo(): void {
    const data = this.cliente.cliDataNascimento || '';
    
    if (!data || data.length !== 10) {
      this.dataNascimentoError = 'Data de nascimento inválida (dd/mm/aaaa)';
      return;
    }

    if (!this.validarMaiorIdade(data)) {
      this.dataNascimentoError = 'Cliente deve ser maior de idade (18 anos)';
      return;
    }

    this.dataNascimentoError = '';
  }

  // Formata CEP com máscara
  formatarCEP(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 8) {
      if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
      }
      this.cep = value;
      this.cepError = '';
      
      // Busca automaticamente quando tiver 8 dígitos
      const cepLimpo = value.replace(/\D/g, '');
      if (cepLimpo.length === 8) {
        // Pequeno delay para evitar múltiplas buscas
        setTimeout(() => {
          this.buscarCEP();
        }, 300);
      } else if (cepLimpo.length < 8) {
        // Limpa endereço se CEP estiver incompleto
        this.limparEndereco();
      }
    }
  }

  // Busca endereço por CEP usando ViaCEP
  buscarCEP(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      this.cepError = 'CEP deve ter 8 dígitos';
      return;
    }

    // Evita buscar novamente se já buscou o mesmo CEP
    if (this.ultimoCepBuscado === cepLimpo && this.endereco.logradouro) {
      return;
    }

    // Evita múltiplas buscas simultâneas
    if (this.buscandoCEP) {
      return;
    }

    this.buscandoCEP = true;
    this.cepError = '';
    this.ultimoCepBuscado = cepLimpo;

    // API ViaCEP
    this.http.get(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe({
      next: (data: any) => {
        this.buscandoCEP = false;
        
        if (data.erro) {
          this.cepError = 'CEP não encontrado';
          this.limparEndereco();
          this.ultimoCepBuscado = '';
          return;
        }

        // Preencher campos do endereço
        this.endereco.logradouro = data.logradouro || '';
        this.endereco.bairro = data.bairro || '';
        this.endereco.cidade = data.localidade || '';
        this.endereco.uf = data.uf || '';
        
        this.enderecoError = '';
      },
      error: (error) => {
        this.buscandoCEP = false;
        this.cepError = 'Erro ao buscar CEP. Tente novamente.';
        this.limparEndereco();
        this.ultimoCepBuscado = '';
      }
    });
  }

  // Limpa campos do endereço
  limparEndereco(): void {
    this.endereco.logradouro = '';
    this.endereco.bairro = '';
    this.endereco.cidade = '';
    this.endereco.uf = '';
    this.endereco.numero = '';
  }

  // Validação de endereço
  validarEndereco(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');

    if (!cepLimpo || cepLimpo.length !== 8) {
      this.enderecoError = 'CEP é obrigatório e deve ter 8 dígitos';
      return;
    }

    if (!this.endereco.logradouro || !this.endereco.logradouro.trim()) {
      this.enderecoError = 'CEP inválido ou endereço não encontrado';
      return;
    }

    if (!this.endereco.numero || !this.endereco.numero.trim()) {
      this.enderecoError = 'Número da casa é obrigatório';
      return;
    }

    this.enderecoError = '';
  }

  // Monta endereço completo para salvar
  montarEnderecoCompleto(): string {
    const partes = [];
    
    if (this.endereco.logradouro) {
      partes.push(this.endereco.logradouro);
    }
    
    if (this.endereco.numero) {
      partes.push(`Nº ${this.endereco.numero}`);
    }
    
    if (this.endereco.bairro) {
      partes.push(this.endereco.bairro);
    }
    
    if (this.endereco.cidade) {
      partes.push(this.endereco.cidade);
    }
    
    if (this.endereco.uf) {
      partes.push(this.endereco.uf);
    }
    
    if (this.cep) {
      partes.push(`CEP: ${this.cep}`);
    }
    
    return partes.join(', ');
  }

  createProduct(): void {
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

    // Validar data de nascimento e maioridade
    if (!this.cliente.cliDataNascimento || this.cliente.cliDataNascimento.length !== 10) {
      this.dataNascimentoError = 'Data de nascimento inválida (dd/mm/aaaa)';
      this.clienteService.showMessage('Data de nascimento inválida!');
      return;
    }

    if (!this.validarMaiorIdade(this.cliente.cliDataNascimento)) {
      this.dataNascimentoError = 'Cliente deve ser maior de idade (18 anos)';
      this.clienteService.showMessage('Cliente deve ser maior de idade (18 anos)!');
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

    // Montar endereço completo
    const enderecoCompleto = this.montarEnderecoCompleto();

    // Salvar CPF apenas com números e data no formato do backend
    const clienteParaEnviar = {
      ...this.cliente,
      cliCpf: cpfLimpo,
      cliDataNascimento: dataNascimentoBackend,
      endProprietario: enderecoCompleto
    };

    this.clienteService.create(clienteParaEnviar).subscribe(() => {
      this.clienteService.showMessage('cliente criado!')
      this.router.navigate(['/fcliente'])
    })
  }

  cancel(): void {
    this.router.navigate(['/fcliente'])
  }  
}
