import { NgModule } from '@angular/core';
import { BackdropComponent } from './component/backdrop/backdrop.component';
import { ModalComponent } from './component/modal/modal.component';
import { ModalContainerComponent } from './component/modal-container/modal-container.component';
import { ModalService } from './services/modal.service';
import { ModalEventsService } from './services/modal-events.service';
import { NavParams, NavParamsToken, provideNavParamsInjectable } from './utils/nav-params';
import { ViewController, ViewControllerToken } from './utils/view-controller';


@NgModule({
  declarations: [
    BackdropComponent,
    ModalComponent,
    ModalContainerComponent,
  ],
  imports: [],
  exports: [],
  entryComponents: [
    ModalContainerComponent,
    ModalComponent,
    BackdropComponent,
  ],
  providers: [
    ModalService,
    ModalEventsService,
    [
      {
        provide: NavParamsToken, useValue: {},
      },
      {
        provide: NavParams, useFactory: provideNavParamsInjectable, deps: [NavParamsToken],
      },
    ],
    [
      {
        provide: ViewControllerToken, useValue: '',
      },
      {
        provide: ViewController, useFactory: provideNavParamsInjectable, deps: [ViewControllerToken, NavParams],
      },
    ],
  ],
})
export class ModalServiceModule {
}
