import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cliente.model';

@Component({
  selector: 'app-cliente-read',
  templateUrl: './cliente-read.component.html',
  styleUrls: ['./cliente-read.component.css']
})
export class ClienteReadComponent implements OnInit {

  clientes: Cliente[] = [];

  // IMPORTANTE: RG está incluído aqui
  displayedColumns: string[] = [ 'cliNome', 'cliCpf',  'cliAtivo', 'action'];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.clienteService.read().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  // Função para verificar se cliente está ativo
  // Backend retorna cliAtivo como String ("true" ou "false")
  isAtivoCliente(cliAtivo: string | boolean | undefined | null): boolean {
    if (cliAtivo === true) {
      return true;
    }
    if (typeof cliAtivo === 'string') {
      // Converte para minúscula para garantir comparação correta
      return cliAtivo.toLowerCase() === 'true';
    }
    return false;
  }

  // Formata CPF no formato 000.000.000-00
  formatarCPF(cpf: string | undefined): string {
    if (!cpf) {
      return '';
    }
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
      return cpf; // Retorna o CPF original se não tiver 11 dígitos
    }
    
    // Aplica a máscara 000.000.000-00
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
