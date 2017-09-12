import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';


import { APP_ROUTING } from './app.routes';

import { AuthService} from "./services/auth.service";
import { AuthGuardService} from "./services/auth-guard.service";
import { AuthFireBaseService} from "./services/authFireBase.service";
import { JugadoresService} from "./services/jugadores.service";
import { UsuariosService} from "./services/usuarios.service";
import { EquiposService} from "./services/equipos.service";

// Pipes
import { FilterPipe } from './pipes/filter.pipe';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { EdicionJugadorComponent } from './components/jugadores/edicion.component';
import { JugadoresComponent } from './components/jugadores/jugadores.component';
import { JugadorComponent } from './components/jugadores/jugador.component';
import { PerfilComponent } from './components/usuarios/perfil.component';
import {EquiposComponent } from './components/equipos/equipos.component';
import { EdicionEquipoComponent } from './components/equipos/edicionequipo.component';

export const firebaseConfig = {
    apiKey: "AIzaSyCoO5GkKlmYJ9OIjZjtezgay9Q0njd1mn4",
    authDomain: "myteam-6f11c.firebaseapp.com",
    databaseURL: "https://myteam-6f11c.firebaseio.com",
    projectId: "myteam-6f11c",
    storageBucket: "myteam-6f11c.appspot.com",
    messagingSenderId: "79183864846"
  };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    EdicionJugadorComponent,
    JugadoresComponent,
    JugadorComponent,
    PerfilComponent,
    FilterPipe,
    EquiposComponent,
    EdicionEquipoComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    APP_ROUTING,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AuthService,AuthGuardService, JugadoresService, UsuariosService, EquiposService, AuthFireBaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
