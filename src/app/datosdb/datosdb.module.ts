import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosdbPageRoutingModule } from './datosdb-routing.module';

import { DatosdbPage } from './datosdb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosdbPageRoutingModule
  ],
  declarations: [DatosdbPage]
})
export class DatosdbPageModule {}
