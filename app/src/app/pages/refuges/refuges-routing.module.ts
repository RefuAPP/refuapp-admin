import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefugesListPage } from './refuge-list/refuges-list.page';
import { adminGuard } from '../../guards/admin.guard';
import { RefugesDetailPage } from './refuge-detail/refuges-detail.page';
import { RefugeCreatePage } from './refuge-create/refuge-create.page';
import { RefugeUdpatePage } from './refuge-update/refuge-udpate.page';

const routes: Routes = [
  {
    path: '',
    component: RefugesListPage,
    canActivate: [adminGuard],
  },
  {
    path: 'create',
    component: RefugeCreatePage,
    canActivate: [adminGuard],
  },
  {
    path: 'update/:id',
    component: RefugeUdpatePage,
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
