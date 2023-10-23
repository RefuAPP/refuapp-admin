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
  GalleryImageOptions,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import {
  CreateRefugeError,
  ServerError,
} from '../../../schemas/refuge/create/create-refuge-error';

@Component({
  selector: 'app-refuge-create',
  templateUrl: './refuge-create.page.html',
  styleUrls: ['./refuge-create.page.scss'],
})
export class RefugeCreatePage implements OnInit {
  form: CreateRefuge = {
    name: '',
    region: '',
    image: '',
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
  ) {}

  ngOnInit() {}

  async createRefugeLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Creant refugi...',
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
    // TODO: Check image, parse and upload if necessary, return form or error
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
        'Ja existeix un refugi amb aquest nom',
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
      header: 'Alerta',
      subHeader: 'El teu dispositiu està fallant',
      message:
        'Funciona la connexió a Internet? Potser és culpa nostra i el nostre servidor està caigut.',
      buttons: [
        {
          text: "Ves a l'inici",
          handler: () => {
            this.alertController.dismiss().then();
            this.router.navigate(['/home']).then();
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

  async pickImage() {
    const options: ImageOptions = {
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    };
    await Camera.getPhoto(options).then((image: Photo) => {
      console.log(image);
    });
  }
}
