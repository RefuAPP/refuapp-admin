import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefugesListPage } from './refuge-list/refuges-list.page';
import { adminGuard } from '../../guards/admin.guard';
import { RefugesDetailPage } from './refuge-detail/refuges-detail/refuges-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RefugesListPage,
    canActivate: [adminGuard],
  },
  {
    path: ':id',
    component: RefugesDetailPage,
    canActivate: [adminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefugesPageRoutingModule {}
