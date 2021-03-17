import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-bodegas',
  templateUrl: './page-bodegas.component.html',
  styleUrls: ['./page-bodegas.component.scss']
})
export class PageBodegasComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {}

  pageMenuRenca() {
    this.route.navigateByUrl('pages/cxp/control/br');
  }

  pageMenuPlanta() {
    this.route.navigateByUrl('pages/cxp/control/bp');
  }

}
