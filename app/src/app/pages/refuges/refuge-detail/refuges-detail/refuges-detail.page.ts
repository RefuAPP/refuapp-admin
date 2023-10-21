import { Component, OnInit } from '@angular/core';
import { Refuge } from '../../../../schemas/refuge/refuge';
import { ActivatedRoute, Router } from '@angular/router';
import { RefugeService } from '../../../../services/refuge/refuge.service';
import { AlertController } from '@ionic/angular';
import {
  GetRefugeFromIdErrors,
  GetRefugeResponse,
} from '../../../../schemas/refuge/get-refuge-schema';
import { match } from 'ts-pattern';

@Component({
  selector: 'app-refuges-detail',
  templateUrl: './refuges-detail.page.html',
  styleUrls: ['./refuges-detail.page.scss'],
})
export class RefugesDetailPage implements OnInit {
  refuge?: Refuge;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private refugeService: RefugeService,
    private alertController: AlertController,
  ) {
    const refugeId = this.getRefugeIdFromUrl();
    this.fetchRefuge(refugeId).then();
  }

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }

  clickButton() {
    console.log('click');
  }

  ngOnInit() {}

  private async fetchRefuge(refugeId: string | null): Promise<void> {
    if (refugeId != null) this.fetchRefugeFromId(refugeId);
    else this.router.navigate(['login']).then();
  }

  private getRefugeIdFromUrl(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  private fetchRefugeFromId(refugeId: string) {
    this.refugeService.getRefugeFrom(refugeId).subscribe({
      next: (response: GetRefugeResponse) =>
        this.handleGetRefugeResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleGetRefugeResponse(response: GetRefugeResponse) {
    match(response)
      .with({ status: 'correct' }, (response) => (this.refuge = response.data))
      .with({ status: 'error' }, (response) => {
        this.handleError(response.error);
      })
      .exhaustive();
  }

  private handleError(error: GetRefugeFromIdErrors) {
    match(error)
      .with(GetRefugeFromIdErrors.NOT_FOUND, () => this.handleNotFoundRefuge())
      .with(GetRefugeFromIdErrors.CLIENT_SEND_DATA_ERROR, () =>
        this.handleBadUserData(),
      )
      .with(GetRefugeFromIdErrors.UNKNOWN_ERROR, () =>
        this.handleUnknownError(),
      )
      .with(
        GetRefugeFromIdErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
        GetRefugeFromIdErrors.PROGRAMMER_SEND_DATA_ERROR,
        () => this.handleBadProgrammerData(),
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
            this.fetchRefuge(this.getRefugeIdFromUrl());
          },
        },
      ],
    });
    return await alert.present();
  }

  private handleNotFoundRefuge() {
    this.router
      .navigate(['not-found-page'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleBadProgrammerData() {
    this.router
      .navigate(['programming-error'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleBadUserData() {
    this.router
      .navigate(['not-found-page'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleUnknownError() {
    this.router
      .navigate(['internal-error-page'], {
        skipLocationChange: true,
      })
      .then();
  }
}
