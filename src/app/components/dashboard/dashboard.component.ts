import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserInterface } from '../../models/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  user: UserInterface;
  constructor(public authService: AuthService) {
    this.user = authService.userData;
    console.log(this.user);
  }
}
