import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-renca',
  templateUrl: './menu-renca.component.html',
  styleUrls: ['./menu-renca.component.scss']
})
export class MenuRencaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  pageIngreso() {
    this.router.navigateByUrl('pages/cxp/control/br/ingreso');
  }

  pageEgreso() {
    this.router.navigateByUrl('pages/cxp/control/br/egreso');
  }

}
