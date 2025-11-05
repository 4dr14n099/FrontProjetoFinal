import { Component, OnInit } from '@angular/core';
import { Pedido } from '../pedido.model';
import { PedidoService } from '../pedido.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pedido-delete',
  templateUrl: './pedido-delete.component.html',
  styleUrls: ['./pedido-delete.component.css']
})
export class PedidoDeleteComponent implements OnInit {

  pedido: Pedido = {
    cliente: {} as any,
    pedValorTotal: 0,
    pedStatus: ''
  }

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const pedId = this.route.snapshot.paramMap.get('pedId');
    if (pedId) {
      this.pedidoService.readById(pedId).subscribe(pedido => {
        this.pedido = pedido;
      });
    }
  }

  deletePedido(): void {
    if (this.pedido.pedId) {
      this.pedidoService.delete(this.pedido.pedId).subscribe(() => {
        this.pedidoService.showMessage('Pedido excluído!');
        this.router.navigate(['/fpedido']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/fpedido']);
  }
}
