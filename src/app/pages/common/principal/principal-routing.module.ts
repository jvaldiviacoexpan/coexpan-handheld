import { PrincipalComponent } from './principal.component';
import { InicioComponent } from './inicio/inicio.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';


const routes: Routes = [{
  path: '',
  component: PrincipalComponent,
  children: [
    {
      path: 'inicio',
      component: InicioComponent,
    },
    {
      path: 'login',
      component: LoginComponent,
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
  LoginComponent,
];
