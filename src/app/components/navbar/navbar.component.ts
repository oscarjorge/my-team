import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { AuthFireBaseService} from '../../services/authFireBase.service'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() teamChanged = new EventEmitter();
  constructor(private _authService:AuthFireBaseService,
    private router: Router) { 
    //auth.handleAuthentication();
  }
  auth = null;
  ngOnInit() {
  }
  login() {
     this._authService.login();
  }
  salir(){
    this._authService.logout();
  }
  Perfil() {
    this.router.navigate(['perfil', localStorage.getItem('uid')]);
  }
  TeamChanged(){
    this.teamChanged.emit();
  }
  
  isAuthAsync() {
      return this._authService.isAuthenticatedAsync();
  }
}
