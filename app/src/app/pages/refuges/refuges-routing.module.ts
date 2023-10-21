import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefugesListPage } from './refuge-list/refuges-list.page';
import { adminGuard } from '../../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: RefugesListPage,
    canActivate: [adminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefugesPageRoutingModule {}
