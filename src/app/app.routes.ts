import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { EdicionJugadorComponent } from './components/jugadores/edicion.component';
import {JugadoresComponent } from './components/jugadores/jugadores.component';
import {JugadorComponent } from './components/jugadores/jugador.component';
import {PerfilComponent } from './components/usuarios/perfil.component';
import {EquiposComponent } from './components/equipos/equipos.component';
import { EdicionEquipoComponent } from './components/equipos/edicionequipo.component';

import { AuthFireBaseService } from './services/authFireBase.service';
const APP_ROUTES: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'jugadores', component: JugadoresComponent},
    { path: 'jugador/:id', component: JugadorComponent },
    {canActivate:[ AuthFireBaseService ], path: 'editarJugador/:id', component: EdicionJugadorComponent},
    {canActivate:[ AuthFireBaseService ], path: 'perfil/:id', component: PerfilComponent},
    { path: 'equipos', component: EquiposComponent},
    {canActivate:[ AuthFireBaseService ], path: 'editarEquipo/:id', component: EdicionEquipoComponent},
    { path:'**', pathMatch:'full', redirectTo:'home'}
]
 export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
//export const app_routing = RouterModule.forRoot(APP_ROUTES, { useHash: true });