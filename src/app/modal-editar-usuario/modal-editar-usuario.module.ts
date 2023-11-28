import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalEditarUsuarioPageRoutingModule } from './modal-editar-usuario-routing.module';
import { ModalEditarUsuarioPage } from './modal-editar-usuario.page';

@NgModule({
  declarations: [ModalEditarUsuarioPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEditarUsuarioPageRoutingModule
  ],
})
export class ModalEditarUsuarioPageModule {}



