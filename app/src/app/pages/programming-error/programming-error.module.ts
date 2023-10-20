import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgrammingErrorPageRoutingModule } from './programming-error-routing.module';

import { ProgrammingErrorPage } from './programming-error.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgrammingErrorPageRoutingModule,
  ],
  declarations: [ProgrammingErrorPage],
})
export class ProgrammingErrorPageModule {}
