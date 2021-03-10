import { NgModule } from '@angular/core';
import { PrincipalRoutingModule, routedComponents } from './principal-routing.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    PrincipalRoutingModule,
  ],
  declarations: [
    ...routedComponents
  ],
})

export class PrincipalModule {}
