import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from './components/template/header/header.component';
import { NavComponent } from './components/template/nav/nav.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit {
  //conseguimos usar esse variavel no arquivo app.component.html
  title = 'frontend';

  @ViewChild('header') headerComponent!: HeaderComponent;
  @ViewChild('nav') navComponent!: NavComponent;

  ngAfterViewInit(): void {
    if (this.headerComponent && this.navComponent) {
      this.headerComponent.setNavComponent(this.navComponent);
    }
  }
}
