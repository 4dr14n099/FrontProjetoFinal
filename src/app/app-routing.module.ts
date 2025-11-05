import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import { FormaPagamentoCrudComponent } from './views/forma-pagamento-crud/forma-pagamento-crud.component';
import { ProdutoCrudComponent } from './views/produto-crud/produto-crud.component';
import { ClienteCrudComponent } from './views/cliente-crud/cliente-crud.component';
import { ClienteCreateComponent } from './components/Cliente/cliente-create/cliente-create.component';
import { ClienteUpdateComponent } from './components/Cliente/cliente-update/cliente-update.component';
import { ClienteDeleteComponent } from './components/Cliente/cliente-delete/cliente-delete.component';
import { ProdutoCreateComponent } from './components/Produto/produto-create/produto-create.component';
import { ProdutoUpdateComponent } from './components/Produto/produto-update/produto-update.component';
import { ProdutoDeleteComponent } from './components/Produto/produto-delete/produto-delete.component';
import { FormaPagamentoCreateComponent } from './components/formaPagamento/forma-pagamento-create/forma-pagamento-create.component';
import { FormaPagamentoUpdateComponent } from './components/formaPagamento/forma-pagamento-update/forma-pagamento-update.component';
import { FormaPagamentoDeleteComponent } from './components/formaPagamento/forma-pagamento-delete/forma-pagamento-delete.component';

//configuração para rotear entre as paginas na home
const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "fpagamentos",
    component: FormaPagamentoCrudComponent
  },
  {
    path: "fpagamentos/create",
    component: FormaPagamentoCreateComponent
  },
  {
    path: "fpagamentos/update/:formId",
    component: FormaPagamentoUpdateComponent
  },
  {
    path: "fpagamentos/delete/:formId",
    component: FormaPagamentoDeleteComponent
  },
  {
    path: "fproduto",
    component: ProdutoCrudComponent
  },
  {
    path: "fproduto/create",
    component: ProdutoCreateComponent
  },
  {
    path: "fproduto/update/:proId",
    component: ProdutoUpdateComponent
  },
  {
    path: "fproduto/delete/:proId",
    component: ProdutoDeleteComponent
  },
  {
    path: "fcliente",
    component: ClienteCrudComponent
  },
   {
    path: "fcliente/create",
    component: ClienteCreateComponent
  },
   {
    path: "fcliente/update/:cliId",
    component: ClienteUpdateComponent
  },
   {
    path: "fcliente/delete/:cliId",
    component: ClienteDeleteComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
