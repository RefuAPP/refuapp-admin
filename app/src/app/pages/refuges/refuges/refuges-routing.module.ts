import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefugesPage } from './refuges.page';
import { adminGuard } from '../../../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: RefugesPage,
    canActivate: [adminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefugesPageRoutingModule {}
