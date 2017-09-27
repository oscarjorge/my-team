import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { MyDatePickerModule } from 'mydatepicker';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { ChartsModule } from 'ng2-charts';

import { APP_ROUTING } from './app.routes';

import { AuthService} from "./services/auth.service";
import { AuthGuardService} from "./services/auth-guard.service";
import { AuthFireBaseService} from "./services/authFireBase.service";
import { JugadoresService} from "./services/jugadores.service";
import { UsuariosService} from "./services/usuarios.service";
import { EquiposService} from "./services/equipos.service";
import { SedesService} from "./services/sedes.service";
import { GruposService} from "./services/grupos.service";
import { DivisionesService} from "./services/divisiones.service";
import { TorneosService} from "./services/torneos.service";
import { TemporadasService} from "./services/temporadas.service";
import { PartidosService} from "./services/partidos.service";
import { CamposService} from "./services/campos.service";

// Pipes
import { FilterPipe } from './pipes/filter.pipe';
import { DisplayTorneoPipe } from './pipes/displayTorneo.pipe';

import { AppComponent } from './app.component';
import { ClasificacionesComponent } from './components/clasificaciones/clasificaciones.component';
import { EstadisticasJugadorComponent } from './components/estadisticasJugador/estadisticasJugador.component';
import { GolesJugadoresComponent } from './components/graficos/golesJugadores.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { EdicionJugadorComponent } from './components/jugadores/edicion.component';
import { JugadoresComponent } from './components/jugadores/jugadores.component';
import { JugadorComponent } from './components/jugadores/jugador.component';
import { PerfilComponent } from './components/usuarios/perfil.component';
import { PerfilNavBarComponent } from './components/usuarios/perfilnavbar.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import { EdicionEquipoComponent } from './components/equipos/edicionequipo.component';
import { AdministracionMainComponent } from './components/administracion/administracion-main.component';
import { SedesComponent } from './components/administracion/sedes/sedes.component';
import { GruposComponent } from './components/administracion/grupos/grupos.component';
import { DivisionesComponent } from './components/administracion/divisiones/divisiones.component';
import { TorneoComponent } from './components/administracion/torneo/torneo.component';
import { BuscadorTorneosComponent } from './components/administracion/torneo/buscador-torneos.component';
import { PartidosComponent } from './components/administracion/partidos/partidos.component';
import { CamposComponent } from './components/campos/campos.component';
import { CamposViewMapComponent } from './components/campos/campos.viewmap.component';
import { ResultadoEditarComponent } from './components/administracion/resultados/resultado.editar.component';

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
    ClasificacionesComponent,
    EstadisticasJugadorComponent,
    GolesJugadoresComponent,
    NavbarComponent,
    HomeComponent,
    EdicionJugadorComponent,
    JugadoresComponent,
    JugadorComponent,
    PerfilComponent,
    PerfilNavBarComponent,
    EquiposComponent,
    EdicionEquipoComponent,
    AdministracionMainComponent,
    SedesComponent,
    GruposComponent,
    DivisionesComponent,
    TorneoComponent,
    BuscadorTorneosComponent,
    PartidosComponent,
    CamposComponent,
    CamposViewMapComponent,
    ResultadoEditarComponent,

    FilterPipe,
    DisplayTorneoPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    APP_ROUTING,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MyDatePickerModule,
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCL5JnDCJwVwUbr_eghzac-t06f9ROQzLY'
    })
  ],
  providers: [
    AuthService,
    AuthGuardService, 
    JugadoresService,
     UsuariosService, 
     EquiposService, 
     SedesService, 
     GruposService, 
     DivisionesService, 
     TemporadasService,
     TorneosService,
     PartidosService,
     CamposService,
     AuthFireBaseService,
     GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
