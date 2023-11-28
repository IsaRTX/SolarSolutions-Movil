import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { DetallesUsuarioComponent } from './detalles-usuario/detalles-usuario.component'; // Ajusta la ruta según tu estructura de carpetas

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'usuario',
    loadChildren: () => import('./usuario/usuario.module').then( m => m.UsuarioPageModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'recuperacion',
    loadChildren: () => import('./recuperacion/recuperacion.module').then( m => m.RecuperacionPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'datosdb',
    loadChildren: () => import('./datosdb/datosdb.module').then( m => m.DatosdbPageModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'modal-editar-usuario',
    loadChildren: () => import('./modal-editar-usuario/modal-editar-usuario.module').then( m => m.ModalEditarUsuarioPageModule)
  },
  { path: 'detalles-usuario/:id', component: DetallesUsuarioComponent },
  {
    path: 'datos-usuario/:uid',
    loadChildren: () => import('./datos-usuario/datos-usuario.module').then(m => m.DatosUsuarioPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

