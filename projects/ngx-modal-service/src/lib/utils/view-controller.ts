import { InjectionToken } from '@angular/core';

import { ModalEventsService } from '../services/modal-events.service';

export const ViewControllerToken = new InjectionToken('ViewControllerToken');

export const provideViewControllerInjectable = (GUID: string, modalEventsService: ModalEventsService) => {
  return new ViewController(GUID, modalEventsService);
};

export class ViewController {
  constructor(public GUID, private modalEventsService: ModalEventsService) {
  }

  dismiss(data = {}) {
    this.modalEventsService.dismiss(this.GUID, data);
  }
}
