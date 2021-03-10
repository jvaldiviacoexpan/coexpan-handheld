import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-pages',
  template: `<ion-router-outlet></ion-router-outlet>`
})

export class PagesComponent implements OnInit {
  constructor(){}

  ngOnInit(): void { }

}
