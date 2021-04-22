import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ControlProductosRoutingModule, routedComponents } from './control-productos-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ControlProductosRoutingModule,
  ],
  declarations: [
    ...routedComponents,
  ]
})

export class ControlProductosModule {}
