import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-slate-50">
      <app-navbar />
      <main class="py-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}
