import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-control',
  templateUrl: './page-control.component.html',
  styleUrls: ['./page-control.component.scss']
})
export class PageControlComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void { }

  pageBodegasCxp() {
    this.route.navigateByUrl('pages/cxp/control/bodegas');
  }

}
