import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ControlProductosRoutingModule, routedComponents } from './control-productos-routing.module';
import { CommonModule } from '@angular/common';
import { PageBodegasComponent } from './page-bodegas/page-bodegas.component';
import { MenuRencaComponent } from './bodega-renca/menu-renca/menu-renca.component';
import { BpEntradaMercanciaComponent } from './bodega-planta/bp-entrada-mercancia/bp-entrada-mercancia.component';
import { BpSalidaMercanciaComponent } from './bodega-planta/bp-salida-mercancia/bp-salida-mercancia.component';
import { BpMenuPlantaComponent } from './bodega-planta/bp-menu-planta/bp-menu-planta.component';


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
    BpEntradaMercanciaComponent,
    BpSalidaMercanciaComponent,
    BpMenuPlantaComponent,
  ]
})

export class ControlProductosModule {}
