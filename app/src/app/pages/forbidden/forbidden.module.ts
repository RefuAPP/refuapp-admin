import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForbiddenPageRoutingModule } from './forbidden-routing.module';

import { ForbiddenPage } from './forbidden.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForbiddenPageRoutingModule,
    TranslateModule,
  ],
  declarations: [ForbiddenPage],
})
export class ForbiddenPageModule {}
