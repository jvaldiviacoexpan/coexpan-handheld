import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { IonicModule } from '@ionic/angular';
import { PrincipalModule } from './common/principal/principal.module';



@NgModule({
  imports: [
    PagesRoutingModule,
    IonicModule,
    PrincipalModule,
  ],
  declarations: [
    PagesComponent,
  ]
})

export class PagesModule { }
