import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefugesPageRoutingModule } from './refuges-routing.module';

import { RefugesListPage } from './refuge-list/refuges-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefugesPageRoutingModule,
    NgOptimizedImage,
  ],
  declarations: [RefugesListPage],
})
export class RefugesPageModule {}
