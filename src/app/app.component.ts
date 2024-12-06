import { Component , Renderer2} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPageComponent } from "./main-page/main-page.component";
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainPageComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';
  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'no-pointer');
}
}
