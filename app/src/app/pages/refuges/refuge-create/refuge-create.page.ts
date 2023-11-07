import { Component, OnInit } from '@angular/core';
import { CreateRefuge, Refuge } from '../../../schemas/refuge/refuge';
import { Router } from '@angular/router';
import { RefugeService } from '../../../services/refuge/refuge.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { CreateRefugeResponse } from '../../../schemas/refuge/create/create-refuge-response';
import { match } from 'ts-pattern';
import {
  Camera,
  CameraResultType,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import {
  CreateRefugeError,
  ServerError,
} from '../../../schemas/refuge/create/create-refuge-error';
import { ImageService } from '../../../services/image/image.service';
import {
  PostImageErrors,
  PostImageResponse,
} from '../../../schemas/image/post-image-schema';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-refuge-create',
  templateUrl: './refuge-create.page.html',
  styleUrls: ['./refuge-create.page.scss'],
})
export class RefugeCreatePage implements OnInit {
  form: CreateRefuge = {
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
    private refugeService: RefugeService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private imageService: ImageService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {}

  async createRefugeLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: this.translateService.instant('REFUGES.CREATE.LOADING'),
      translucent: true,
    });
    return await loading.present();
  }

  onCreate(form: NgForm) {
    if (form.invalid) return;
    const request = this.uploadImage(this.form);
    this.createRefuge(request);
  }

  private uploadImage(form: CreateRefuge): CreateRefuge {
    return form;
  }

  private createRefuge(request: CreateRefuge): void {
    this.createRefugeLoading().then(() => {
      this.refugeService.createRefuge(request).subscribe({
        next: (response: CreateRefugeResponse) => {
          this.handleCreateRefugeResponse(response);
        },
        error: () => {
          this.handleClientError().then();
        },
      });
    });
  }

  private handleCreateRefugeResponse(response: CreateRefugeResponse): void {
    match(response)
      .with({ status: 'created' }, (response) => {
        this.handleCorrectCreateRefugeResponse(response.data);
      })
      .with({ status: 'error' }, async (response) => {
        this.handleError(response.error);
      })
      .exhaustive();
  }

  private handleCorrectCreateRefugeResponse(refuge: Refuge) {
    this.loadingController.dismiss().then(() => {
      this.router.navigate(['/refuges/', refuge.id]).then();
    });
  }

  private handleError(error: CreateRefugeError) {
    match(error)
      .with(ServerError.UNAUTHORIZED, () => {
        this.handleUnauthorizedError().then();
      })
      .with(ServerError.FORBIDDEN, () => {
        this.handleForbiddenError().then();
      })
      .with(ServerError.NOT_FOUND, () => {
        this.handleNotFoundError().then();
      })
      .with(ServerError.CONFLICT, () => {
        this.handleConflictError().then();
      })
      .with(ServerError.INCORRECT_DATA, () => {
        this.handleIncorrectDataError().then();
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
        this.translateService.instant('UNAUTHORIZED_ERROR.MESSAGE'),
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

  private async handleNotFoundError() {
    await this.showError(async () => {
      await this.router
        .navigate(['/not-found'], {
          skipLocationChange: true,
        })
        .then();
    });
  }

  private async handleConflictError() {
    await this.showError(async () => {
      await this.showErrorMessage(
        this.translateService.instant('REFUGES.FORM.ERRORS.CONFLICT'),
      ).then();
    });
  }

  private async handleIncorrectDataError() {
    await this.showError(async () => {
      await this.router
        .navigate(['/programming-error'], {
          skipLocationChange: true,
        })
        .then();
    });
  }

  private async handleUnknownError() {
    await this.showError(async () => {
      await this.router
        .navigate(['/internal-error-page'], {
          skipLocationChange: true,
        })
        .then();
    });
  }

  private async handleClientError() {
    const alert = await this.alertController.create({
      header: this.translateService.instant('HOME.CLIENT_ERROR.HEADER'),
      subHeader: this.translateService.instant('HOME.CLIENT_ERROR.SUBHEADER'),
      message: this.translateService.instant('HOME.CLIENT_ERROR.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('HOME.CLIENT_ERROR.EXIT'),
          handler: () => {
            this.alertController.dismiss().then();
            this.router.navigate(['/refuges']).then();
          },
        },
      ],
    });
    await this.showError(async () => await alert.present());
  }

  private async showError(func: (() => void) | (() => Promise<void>)) {
    await this.loadingController.dismiss();
    await func();
  }

  private async showErrorMessage(message: string) {
    this.hasError = true;
    await this.showError(() => (this.errorMessage = message));
  }

  async postImageLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: this.translateService.instant('REFUGES.FORM.IMAGE.LOADING'),
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
        this.handleIncorrectDataError().then();
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
        this.translateService.instant('REFUGES.FORM.IMAGE.ERROR'),
      ).then();
    });
  }
}
