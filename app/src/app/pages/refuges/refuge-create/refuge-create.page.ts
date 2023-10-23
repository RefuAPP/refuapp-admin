import { Component, OnInit } from '@angular/core';
import { CreateRefuge } from '../../../schemas/refuge/refuge';
import { Router } from '@angular/router';
import { RefugeService } from '../../../services/refuge/refuge.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

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

  private createRefuge(form: CreateRefuge): void {
    this.createRefugeLoading().then(() => {
      this.refugeService.createRefuge(form).subscribe((response) => {
        this.loadingController.dismiss().then();
      });
    });
  }
}
