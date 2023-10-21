import { Component, OnInit } from '@angular/core';
import { RefugeService } from '../../../services/refuge/refuge.service';
import { AlertController } from '@ionic/angular';
import { match } from 'ts-pattern';
import { Refuge } from '../../../schemas/refuge/refuge';
import {
  GetAllRefugesErrors,
  GetAllRefugesResponse,
} from '../../../schemas/refuge/get-all-refuges-schema';
import { Router } from '@angular/router';

@Component({
  selector: 'app-refuges',
  templateUrl: './refuges.page.html',
  styleUrls: ['./refuges.page.scss'],
})
export class RefugesPage implements OnInit {
  refuges: Refuge[] = [];

  constructor(
    private router: Router,
    private refugeService: RefugeService,
    private alertController: AlertController,
  ) {
    this.getRefuges();
  }

  ngOnInit() {}

  getRefuges() {
    return this.refugeService.getRefuges().subscribe({
      next: (response: any) => this.handleGetAllRefugesResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleGetAllRefugesResponse(response: GetAllRefugesResponse) {
    match(response)
      .with({ status: 'correct' }, (response) => (this.refuges = response.data))
      .with({ status: 'error' }, (response) => {
        this.handleError(response.error);
      })
      .exhaustive();
  }

  private handleError(error: GetAllRefugesErrors) {
    match(error)
      .with(GetAllRefugesErrors.UNKNOWN_ERROR, () => this.handleUnknownError())
      .with(GetAllRefugesErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR, () =>
        this.handleBagProgrammerData(),
      )
      .exhaustive();
  }

  private async handleClientError() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'The client is failing',
      message:
        'Is your internet connection working? Maybe is our fault and our server is down.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.alertController.dismiss().then();
            this.getRefuges();
          },
        },
      ],
    });
    return await alert.present();
  }

  private handleUnknownError() {
    this.router
      .navigate(['internal-error-page'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleBagProgrammerData() {
    this.router
      .navigate(['programming-error'], {
        skipLocationChange: true,
      })
      .then();
  }
}
