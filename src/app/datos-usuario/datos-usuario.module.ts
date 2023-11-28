import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosUsuarioPageRoutingModule } from './datos-usuario-routing.module';

import { DatosUsuarioPage } from './datos-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosUsuarioPageRoutingModule
  ],
  declarations: [DatosUsuarioPage]
})
export class DatosUsuarioPageModule {}
