import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-crud',
  templateUrl: './pedido-crud.component.html',
  styleUrls: ['./pedido-crud.component.css']
})
export class PedidoCrudComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToPedidoCreate(): void {
    this.router.navigate(['/fpedido/create']);
  }
}
