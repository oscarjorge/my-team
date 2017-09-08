import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { AuthFireBaseService} from '../../services/authFireBase.service'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService:AuthFireBaseService,
    private router: Router) { 
    //auth.handleAuthentication();
  }
  auth = null;
  ngOnInit() {
  }
  login() {
    //this.auth.login();
    this.authService.login();
  }
  salir(){
    this.authService.logout();
  }
  Perfil() {
    this.router.navigate(['perfil', localStorage.getItem('uid')]);
  }
  isAuthAsync() {
      return this.authService.isAuthenticatedAsync();
  }
}
