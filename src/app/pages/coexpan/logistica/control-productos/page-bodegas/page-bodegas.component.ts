import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-bodegas',
  templateUrl: './page-bodegas.component.html',
  styleUrls: ['./page-bodegas.component.css']
})
export class PageBodegasComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  pageMenuRenca() {
    this.route.navigateByUrl('pages/cxp/control/br');
  }

}
