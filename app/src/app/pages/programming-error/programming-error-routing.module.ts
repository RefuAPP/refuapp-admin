import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgrammingErrorPage } from './programming-error.page';

const routes: Routes = [
  {
    path: '',
    component: ProgrammingErrorPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgrammingErrorPageRoutingModule {}
