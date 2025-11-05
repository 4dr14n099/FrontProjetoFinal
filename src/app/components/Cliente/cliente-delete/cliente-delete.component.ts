import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

  cliente: Cliente = {
    cliNome: '',
    cliCpf: '',
    cliDataNascimento: '',
    cliSexo: ''
  }

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
      });
    }
  }

  deleteCliente(): void {
    if (this.cliente.cliId) {
      this.clienteService.delete(this.cliente.cliId).subscribe(() => {
        this.clienteService.showMessage('Cliente excluído!');
        this.router.navigate(['/fcliente']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fcliente']);
  }
}
