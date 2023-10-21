import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefugesPageRoutingModule } from './refuges-routing.module';

import { RefugesListPage } from './refuge-list/refuges-list.page';
import { RefugesDetailPage } from './refuge-detail/refuges-detail/refuges-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefugesPageRoutingModule,
    NgOptimizedImage,
  ],
  declarations: [RefugesListPage, RefugesDetailPage],
})
export class RefugesPageModule {}
