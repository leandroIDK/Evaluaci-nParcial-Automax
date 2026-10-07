import { Component } from '@angular/core';
import { Inicio } from './components/inicio/inicio';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Inicio],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}