import { NgModule } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { ControlProductosRoutingModule, routedComponents } from './control-productos-routing.module';
import { CommonModule } from '@angular/common';
import { PageBodegasComponent } from './page-bodegas/page-bodegas.component';
import { MenuRencaComponent } from './bodega-renca/menu-renca/menu-renca.component';




@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ControlProductosRoutingModule,
  ],
  declarations: [
    ...routedComponents,
    PageBodegasComponent,
    MenuRencaComponent,
  ]
})

export class ControlProductosModule {}
