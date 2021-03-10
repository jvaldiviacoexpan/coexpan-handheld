import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { InicioComponent } from './common/principal/inicio/inicio.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'inicio',
      component: InicioComponent,
    },
    // PAGINAS COEXPAN
    {
      path: 'cxp/control',
      loadChildren: () => import('./coexpan/logistica/control-productos/control-productos.module')
        .then(m => m.ControlProductosModule),
    },

    // POR DEFECTO
    {
      path: '',
      redirectTo: 'inicio',
      pathMatch: 'full',
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PagesRoutingModule { }
