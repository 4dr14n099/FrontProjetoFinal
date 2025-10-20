import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Router } from '@angular/router';

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
    cliSexo: ''
  }

  //importando productService
  constructor(private clienteService: ClienteService,
    private router: Router) { }
  
  ngOnInit(): void {    
  }

  createProduct(): void {
    this.clienteService.create(this.cliente).subscribe(() => {
      this.clienteService.showMessage('cliente criado!')
      this.router.navigate(['/cliente'])
    })
  }

  cancel(): void {
    this.router.navigate(['/fcliente'])
  }  
}
