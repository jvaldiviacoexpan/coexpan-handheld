import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ControlProductosComponent } from './control-productos.component';
import { PageControlComponent } from './page-control/page-control.component';
import { BrIngresoComponent } from './bodega-renca/br-ingreso/br-ingreso.component';
import { BrEgresoComponent } from './bodega-renca/br-egreso/br-egreso.component';
import { PageBodegasComponent } from './page-bodegas/page-bodegas.component';
import { MenuRencaComponent } from './bodega-renca/menu-renca/menu-renca.component';


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

    // Bodega Renca
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
    }
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
