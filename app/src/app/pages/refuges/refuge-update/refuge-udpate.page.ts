import { Component, OnInit } from '@angular/core';
import { Refuge, UpdateRefuge } from '../../../schemas/refuge/refuge';
import { ActivatedRoute, Router } from '@angular/router';
import { RefugeService } from '../../../services/refuge/refuge.service';
import { AlertController, LoadingController } from '@ionic/angular';
import {
  GetRefugeFromIdErrors,
  GetRefugeResponse,
} from '../../../schemas/refuge/get-refuge-schema';
import { match } from 'ts-pattern';
import {
  Camera,
  CameraResultType,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import {
  PostImageErrors,
  PostImageResponse,
} from '../../../schemas/image/post-image-schema';
import { ImageService } from '../../../services/image/image.service';
import { NgForm } from '@angular/forms';
import { UpdateRefugeResponse } from '../../../schemas/refuge/update/update-refuge-response';
import { UpdateRefugeError } from '../../../schemas/refuge/update/update-refuge-error';
import { ServerError } from '../../../schemas/refuge/create/create-refuge-error';

@Component({
  selector: 'app-refuge-update',
  templateUrl: './refuge-update.page.html',
  styleUrls: ['./refuge-update.page.scss'],
})
export class RefugeUdpatePage implements OnInit {
  refuge?: Refuge;
  form: UpdateRefuge = {
    id: '',
    name: '',
    region: '',
    image: 'no-photo.png',
    altitude: 0,
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    capacity: {
      winter: 0,
      summer: 0,
    },
  };

  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private refugeService: RefugeService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private imageService: ImageService,
  ) {
    const refugeId = this.getRefugeIdFromUrl();
    this.fetchRefuge(refugeId).then();
  }

  ngOnInit() {}

  private getRefugeIdFromUrl(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  private async fetchRefuge(refugeId: string | null): Promise<void> {
    if (refugeId != null) this.fetchRefugeFromId(refugeId);
    else this.router.navigate(['login']).then();
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
      .with({ status: 'correct' }, (response) => {
        this.refuge = response.data;
        this.form = {
          id: this.refuge.id,
          name: this.refuge.name,
          region: this.refuge.region,
          image: this.refuge.image,
          altitude: this.refuge.altitude,
          coordinates: {
            latitude: this.refuge.coordinates.latitude,
            longitude: this.refuge.coordinates.longitude,
          },
          capacity: {
            winter: this.refuge.capacity.winter,
            summer: this.refuge.capacity.summer,
          },
        };
      })
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

  private handleNotFoundRefuge() {
    this.finishLoadAnimAndExecute(() =>
      this.router
        .navigate(['not-found'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private async handleBadProgrammerData() {
    this.finishLoadAnimAndExecute(() =>
      this.router
        .navigate(['programming-error'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private async handleBadUserData() {
    this.finishLoadAnimAndExecute(() =>
      this.router
        .navigate(['not-found-page'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private async handleUnknownError() {
    this.finishLoadAnimAndExecute(() =>
      this.router
        .navigate(['internal-error-page'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
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

  private async finishLoadAnimAndExecute(
    func: (() => void) | (() => Promise<void>),
  ) {
    await this.loadingController.dismiss().then();
    await func();
  }

  async postImageLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Pujant imatge...',
      translucent: true,
    });
    return await loading.present();
  }

  async pickImage() {
    const options: ImageOptions = {
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    };
    await Camera.getPhoto(options).then((image: Photo) => {
      this.postImageLoading().then(() => {
        this.imageService.uploadImage(image).subscribe({
          next: (response: PostImageResponse) => {
            this.handlePostImageResponse(response);
          },
          error: () => {
            this.handleClientError().then();
          },
        });
      });
    });
  }

  private handlePostImageResponse(response: PostImageResponse): void {
    match(response)
      .with({ status: 'correct' }, (response) => {
        this.handleCorrectPostImageResponse(response.data);
      })
      .with({ status: 'error' }, async (response) => {
        this.handleImageError(response.error);
      })
      .exhaustive();
  }

  private handleCorrectPostImageResponse(filePath: string) {
    this.loadingController.dismiss().then(() => {
      this.form.image = filePath;
    });
  }

  private handleImageError(error: PostImageErrors) {
    match(error)
      .with(PostImageErrors.INVALID_REQUEST, () => {
        this.handleInvalidRequestError().then();
      })
      .with(PostImageErrors.PROGRAMMER_SEND_DATA_ERROR, () => {
        this.handleBadProgrammerData().then();
      })
      .with(PostImageErrors.UNKNOWN_ERROR, () => {
        this.handleUnknownError().then();
      })
      .with(PostImageErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR, () => {
        this.handleUnknownError().then();
      })
      .exhaustive();
  }

  private async handleInvalidRequestError() {
    await this.showError(async () => {
      await this.showErrorMessage(
        'El format del fitxer ha de ser .png o .jpeg',
      ).then();
    });
  }

  private async showError(func: (() => void) | (() => Promise<void>)) {
    await this.loadingController.dismiss();
    await func();
  }

  private async showErrorMessage(message: string) {
    this.hasError = true;
    await this.showError(() => (this.errorMessage = message));
  }

  async updateRefugeLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Actualitzant refugi...',
      translucent: true,
    });
    return await loading.present();
  }

  onUpdate(form: NgForm) {
    if (form.invalid) return;
    const request = this.form;
    this.updateRefuge(request);
  }

  private updateRefuge(request: UpdateRefuge) {
    this.updateRefugeLoading().then(() => {
      this.refugeService.updateRefuge(request).subscribe({
        next: (response: UpdateRefugeResponse) =>
          this.handleUpdateRefugeResponse(response),
        error: () => this.handleClientError().then(),
      });
    });
  }

  private handleUpdateRefugeResponse(response: UpdateRefugeResponse) {
    match(response)
      .with({ status: 'updated' }, (response) => {
        this.handleCorrectCreateRefugeResponse(response.data);
      })
      .with({ status: 'error' }, async (response) => {
        this.handleError(response.error);
      })
      .exhaustive();
  }

  private handleCorrectCreateRefugeResponse(refuge: Refuge) {
    this.loadingController.dismiss().then(() => {
      this.router.navigate(['refuges', refuge.id]).then();
    });
  }

  private handleError(error: UpdateRefugeError) {
    match(error)
      .with(ServerError.UNAUTHORIZED, () => {
        this.handleUnauthorizedError().then();
      })
      .with(ServerError.FORBIDDEN, () => {
        this.handleForbiddenError().then();
      })
      .with(ServerError.NOT_FOUND, () => {
        this.handleNotFoundRefuge();
      })
      .with(ServerError.CONFLICT, () => {
        this.handleConflictError().then();
      })
      .with(ServerError.INCORRECT_DATA, () => {
        this.handleBadProgrammerData().then();
      })
      .with(ServerError.UNKNOWN_ERROR, () => {
        this.handleUnknownError().then();
      })
      .with({ type: 'INVALID_USER_DATA' }, (error) => {
        this.showErrorMessage(error.message).then();
      })
      .exhaustive();
  }

  private async handleUnauthorizedError() {
    await this.showError(async () => {
      await this.showErrorMessage(
        'Trapella! La teva sessió no està iniciada!',
      ).then();
    });
  }

  private async handleForbiddenError() {
    await this.showError(async () => {
      await this.router
        .navigate(['/forbidden'], {
          skipLocationChange: true,
        })
        .then();
    });
  }
  private async handleConflictError() {
    await this.showError(async () => {
      await this.showErrorMessage(
        'Ja existeix un refugi amb aquest nom',
      ).then();
    });
  }
  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }
}
