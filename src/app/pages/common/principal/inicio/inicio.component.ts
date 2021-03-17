import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  pageInventario(){
    console.log('navegar al inventario');
  }

  pageLogistica(){
    this.router.navigateByUrl('pages/cxp/control/inicio');
  }


}
