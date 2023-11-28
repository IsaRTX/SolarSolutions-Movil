import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosUsuarioPage } from './datos-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: DatosUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosUsuarioPageRoutingModule {}
