import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEditarUsuarioPage } from './modal-editar-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEditarUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEditarUsuarioPageRoutingModule {}
