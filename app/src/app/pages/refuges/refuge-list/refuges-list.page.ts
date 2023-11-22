import { Component, OnInit } from '@angular/core';
import { RefugeService } from '../../../services/refuge/refuge.service';
import { AlertController } from '@ionic/angular';
import { isMatching, match } from 'ts-pattern';
import { Refuge } from '../../../schemas/refuge/refuge';
import {
  CorrectGetRefuges,
  CorrectGetRefugesPattern,
  ErrorGetRefuges,
  ErrorGetRefugesPattern,
  GetAllRefugesErrors,
} from '../../../schemas/refuge/get-all-refuges-schema';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-refuges',
  templateUrl: './refuges-list.page.html',
  styleUrls: ['./refuges-list.page.scss'],
})
export class RefugesListPage implements OnInit {
  searchTerm: string = '';
  refuges: Observable<Refuge[]>;
  errors: Observable<GetAllRefugesErrors>;
  private search: Subject<String>;

  constructor(
    private router: Router,
    private refugeService: RefugeService,
    private alertController: AlertController,
    private translateService: TranslateService,
  ) {
    this.errors = this.refugeService.getRefuges().pipe(
      filter(
        (response): response is ErrorGetRefuges =>
          !isMatching(ErrorGetRefugesPattern, response),
      ),
      map((response: ErrorGetRefuges) => response.error),
    );
    this.search = new BehaviorSubject<String>('');
    const searchInput = this.search.asObservable();
    const allRefuges = this.refugeService.getRefuges().pipe(
      filter((response): response is CorrectGetRefuges =>
        isMatching(CorrectGetRefugesPattern, response),
      ),
      map((response: CorrectGetRefuges) => response.data),
    );
    this.refuges = combineLatest([searchInput, allRefuges]).pipe(
      map(([searchTerm, refuges]) => {
        if (searchTerm === '') return refuges;
        return refuges.filter((refuge: Refuge) =>
          refuge.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }),
    );
  }

  ngOnInit() {
    this.errors.subscribe({
      next: (error: GetAllRefugesErrors) => this.handleError(error),
      error: () => this.handleClientError().then(),
    });
  }

  getImageUrlFor(refuge: Refuge): string {
    return this.refugeService.getImageUrlFor(refuge);
  }

  searchByName() {
    this.search.next(this.searchTerm);
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
      header: this.translateService.instant('HOME.CLIENT_ERROR.HEADER'),
      subHeader: this.translateService.instant('HOME.CLIENT_ERROR.SUBHEADER'),
      message: this.translateService.instant('HOME.CLIENT_ERROR.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('HOME.CLIENT_ERROR.EXIT'),
          handler: () => {
            this.alertController.dismiss().then();
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
