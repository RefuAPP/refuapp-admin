import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InternalErrorPagePage } from './internal-error-page.page';

const routes: Routes = [
  {
    path: '',
    component: InternalErrorPagePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternalErrorPagePageRoutingModule {}
