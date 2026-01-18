import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private readonly auth : AuthService) { }

  ngOnInit() {
    this.auth.loadUser().subscribe({
      next: (res) => {
        console.log('User loaded:', res);
        this.auth.setRole(res.role);
      },
      error: () => {
        this.auth.logout().subscribe();
      }
    });
  }

}
