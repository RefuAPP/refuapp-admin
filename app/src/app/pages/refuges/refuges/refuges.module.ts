import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefugesPageRoutingModule } from './refuges-routing.module';

import { RefugesPage } from './refuges.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RefugesPageRoutingModule],
  declarations: [RefugesPage],
})
export class RefugesPageModule {}
