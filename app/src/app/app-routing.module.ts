import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'refuges',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'internal-error-page',
    loadChildren: () =>
      import('./pages/internal-error-page/internal-error-page.module').then(
        (m) => m.InternalErrorPagePageModule,
      ),
  },
  {
    path: 'programming-error',
    loadChildren: () =>
      import('./pages/programming-error/programming-error.module').then(
        (m) => m.ProgrammingErrorPageModule,
      ),
  },
  {
    path: 'refuges',
    loadChildren: () =>
      import('./pages/refuges/refuges/refuges.module').then(
        (m) => m.RefugesPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
