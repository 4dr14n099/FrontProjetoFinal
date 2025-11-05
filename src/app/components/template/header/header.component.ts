import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from "src/app/app-routing.module";
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
 
})
export class HeaderComponent implements OnInit {

  navComponent!: NavComponent;

  constructor() { }

  ngOnInit(): void {
  }

  setNavComponent(navComponent: NavComponent): void {
    this.navComponent = navComponent;
  }

  toggleMenu(): void {
    if (this.navComponent) {
      this.navComponent.toggleSidenav();
    }
  }

}
