import { PrincipalComponent } from './principal.component';
import { InicioComponent } from './inicio/inicio.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{
  path: '',
  component: PrincipalComponent,
  children: [
    {
      path: 'inicio',
      component: InicioComponent,
    }
  ]
}];

@NgModule ({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PrincipalRoutingModule {}

export const routedComponents = [
  PrincipalComponent,
  InicioComponent,
];
