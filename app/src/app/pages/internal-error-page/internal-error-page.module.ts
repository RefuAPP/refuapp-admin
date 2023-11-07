import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InternalErrorPagePageRoutingModule } from './internal-error-page-routing.module';

import { InternalErrorPagePage } from './internal-error-page.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InternalErrorPagePageRoutingModule,
    TranslateModule,
  ],
  declarations: [InternalErrorPagePage],
})
export class InternalErrorPagePageModule {}
