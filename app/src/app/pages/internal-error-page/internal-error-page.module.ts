import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InternalErrorPagePageRoutingModule } from './internal-error-page-routing.module';

import { InternalErrorPagePage } from './internal-error-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InternalErrorPagePageRoutingModule,
  ],
  declarations: [InternalErrorPagePage],
})
export class InternalErrorPagePageModule {}
