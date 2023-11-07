import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefugesPageRoutingModule } from './refuges-routing.module';

import { RefugesListPage } from './refuge-list/refuges-list.page';
import { RefugesDetailPage } from './refuge-detail/refuges-detail.page';
import { RefugeCreatePage } from './refuge-create/refuge-create.page';
import { RefugeUdpatePage } from './refuge-update/refuge-udpate.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefugesPageRoutingModule,
    NgOptimizedImage,
    TranslateModule,
  ],
  declarations: [
    RefugesListPage,
    RefugesDetailPage,
    RefugeCreatePage,
    RefugeUdpatePage,
  ],
})
export class RefugesPageModule {}
