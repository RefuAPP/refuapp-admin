import { Component, OnInit } from '@angular/core';
import { Refuge } from '../../../../schemas/refuge/refuge';
import { ActivatedRoute, Router } from '@angular/router';
import { RefugeService } from '../../../../services/refuge/refuge.service';
import { AlertController, LoadingController } from '@ionic/angular';
import {
  GetRefugeFromIdErrors,
  GetRefugeResponse,
} from '../../../../schemas/refuge/get-refuge-schema';
import { match } from 'ts-pattern';
import {
  DeleteRefugeFromIdErrors,
  DeleteRefugeResponse,
} from '../../../../schemas/refuge/delete-refuge-schema';

@Component({
  selector: 'app-refuges-detail',
  templateUrl: './refuges-detail.page.html',
  styleUrls: ['./refuges-detail.page.scss'],
})
export class RefugesDetailPage implements OnInit {
  refuge?: Refuge;
  fabExpanded: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private refugeService: RefugeService,
    private alertController: AlertController,
    private loadingController: LoadingController,
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
        this.handleGetError(response.error);
      })
      .exhaustive();
  }

  private handleGetError(error: GetRefugeFromIdErrors) {
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
    this.finishLoadAnimAndExecute(() =>
      this.router
        .navigate(['not-found'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private handleBadProgrammerData() {
    this.finishLoadAnimAndExecute(() =>
      this.router
        .navigate(['programming-error'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private handleBadUserData() {
    this.finishLoadAnimAndExecute(() =>
      this.router
        .navigate(['not-found-page'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private handleUnknownError() {
    this.finishLoadAnimAndExecute(() =>
      this.router
        .navigate(['internal-error-page'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  toggleFab() {
    this.fabExpanded = !this.fabExpanded;
  }

  editRefuge() {
    console.log('edit refuge');
  }

  deleteRefuge() {
    const alert = this.alertController.create({
      header: 'Esborrar refugi',
      message: 'Estàs segur que vols esborrar el refugi?',
      buttons: [
        {
          text: 'Cancel·lar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => this.alertController.dismiss().then(),
        },
        {
          text: 'Esborrar',
          handler: () => {
            this.alertController
              .dismiss()
              .then(() => this.confirmDeleteRefuge());
          },
        },
      ],
    });
    alert.then((alert) => alert.present());
  }

  private confirmDeleteRefuge() {
    if (this.refuge == undefined) return;
    this.startDeleteRefugeAnimation().then(() => {
      // @ts-ignore
      this.refugeService.deleteRefuge(this.refuge.id).subscribe({
        next: (response: DeleteRefugeResponse) => {
          this.alertController.dismiss().then();
          this.handleDeleteResponse(response);
          // this.router.navigate(['refuges']).then();
        },
        error: () => {
          this.alertController.dismiss().then();
          this.handleClientError().then();
        },
      });
    });
  }

  private handleDeleteResponse(response: DeleteRefugeResponse) {
    match(response)
      .with({ status: 'correct' }, () => {
        this.finishLoadAnimAndExecute(() => {
          this.router.navigate(['refuges']).then();
        }).then();
      })
      .with({ status: 'error' }, (response) => {
        this.handleDeleteError(response.error);
      })
      .exhaustive();
  }

  private handleDeleteError(error: DeleteRefugeFromIdErrors) {
    match(error)
      .with(DeleteRefugeFromIdErrors.UNAUTHORIZED, () =>
        this.handleUnauthorized(),
      )
      .with(DeleteRefugeFromIdErrors.FORBIDDEN, () => this.handleForbidden())
      .with(DeleteRefugeFromIdErrors.NOT_FOUND, () =>
        this.handleNotFoundRefuge(),
      )
      .with(DeleteRefugeFromIdErrors.CLIENT_SEND_DATA_ERROR, () =>
        this.handleBadUserData(),
      )
      .with(DeleteRefugeFromIdErrors.PROGRAMMER_SEND_DATA_ERROR, () =>
        this.handleBadProgrammerData(),
      )
      .with(DeleteRefugeFromIdErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR, () =>
        this.handleUnknownError(),
      )
      .with(DeleteRefugeFromIdErrors.UNKNOWN_ERROR, () =>
        this.handleUnknownError(),
      )
      .exhaustive();
  }

  private handleUnauthorized() {
    this.finishLoadAnimAndExecute(() =>
      this.router.navigate(['login']).then(),
    ).then();
  }

  private handleForbidden() {
    this.finishLoadAnimAndExecute(() =>
      this.router.navigate(['forbidden']).then(),
    ).then();
  }

  private async startDeleteRefugeAnimation() {
    const loading = await this.loadingController.create({
      message: 'Esborrant refugi...',
      translucent: true,
    });
    return await loading.present();
  }

  private async finishLoadAnimAndExecute(
    func: (() => void) | (() => Promise<void>),
  ) {
    await this.loadingController.dismiss().then();
    await func();
  }
}
