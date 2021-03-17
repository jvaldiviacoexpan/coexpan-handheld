import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ControlProductosComponent } from './control-productos.component';
import { PageControlComponent } from './page-control/page-control.component';
import { BrIngresoComponent } from './bodega-renca/br-ingreso/br-ingreso.component';
import { BrEgresoComponent } from './bodega-renca/br-egreso/br-egreso.component';
import { PageBodegasComponent } from './page-bodegas/page-bodegas.component';
import { MenuRencaComponent } from './bodega-renca/menu-renca/menu-renca.component';
import { BpMenuPlantaComponent } from './bodega-planta/bp-menu-planta/bp-menu-planta.component';
import { BpEntradaMercanciaComponent } from './bodega-planta/bp-entrada-mercancia/bp-entrada-mercancia.component';
import { BpSalidaMercanciaComponent } from './bodega-planta/bp-salida-mercancia/bp-salida-mercancia.component';


const routes: Routes = [{
  path: '',
  component: ControlProductosComponent,
  children: [
    {
      path: 'inicio',
      component: PageControlComponent,
    },
    {
      path: 'bodegas',
      component: PageBodegasComponent,
    },

    // #region Bodega Renca
    {
      path: 'br',
      component: MenuRencaComponent,
    },
    {
      path: 'br/ingreso',
      component: BrIngresoComponent,
    },
    {
      path: 'br/egreso',
      component: BrEgresoComponent,
    },
    //#endregion
    //#region Bodega Planta
    {
      path: 'bp',
      component: BpMenuPlantaComponent,
    },
    {
      path: 'bp/em',
      component: BpEntradaMercanciaComponent,
    },
    {
      path: 'bp/sm',
      component: BpSalidaMercanciaComponent,
    }
    //#endregion
  ]
}];

@NgModule ({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ControlProductosRoutingModule {}

export const routedComponents = [
  ControlProductosComponent,
  PageControlComponent,
  BrIngresoComponent,
  BrEgresoComponent,
];

