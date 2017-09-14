import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { EdicionJugadorComponent } from './components/jugadores/edicion.component';
import { JugadoresComponent } from './components/jugadores/jugadores.component';
import { JugadorComponent } from './components/jugadores/jugador.component';
import { PerfilComponent } from './components/usuarios/perfil.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import { SedesComponent } from './components/sedes/sedes.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { DivisionesComponent } from './components/divisiones/divisiones.component';
import { TorneoComponent } from './components/torneo/torneo.component';
import { PartidosComponent } from './components/partidos/partidos.component';
import { EdicionEquipoComponent } from './components/equipos/edicionequipo.component';

import { AuthFireBaseService } from './services/authFireBase.service';
const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'jugadores', component: JugadoresComponent },
    { path: 'jugador/:id', component: JugadorComponent },
    { canActivate: [AuthFireBaseService], path: 'editarJugador/:id', component: EdicionJugadorComponent },
    { canActivate: [AuthFireBaseService], path: 'perfil/:id', component: PerfilComponent },
    { path: 'equipos', component: EquiposComponent },
    { canActivate: [AuthFireBaseService], path: 'editarEquipo/:id', component: EdicionEquipoComponent },
    { canActivate: [AuthFireBaseService], path: 'sedes', component: SedesComponent },
    { canActivate: [AuthFireBaseService], path: 'grupos', component: GruposComponent },
    { canActivate: [AuthFireBaseService], path: 'divisiones', component: DivisionesComponent },
    { canActivate: [AuthFireBaseService], path: 'torneos', component: TorneoComponent },
    { canActivate: [AuthFireBaseService], path: 'partidos', component: PartidosComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
]
//export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });