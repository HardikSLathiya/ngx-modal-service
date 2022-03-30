import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalResponse } from '../types/modal.types';

@Injectable()
export class ModalEventsService {

  onDismiss = new Subject<{ guid: string, result: ModalResponse }>();
  onDestroy = new Subject<string>();

  constructor() {
  }

  dismiss(guid: string, result: any) {
    this.onDismiss.next({ guid, result });
  }

  destroy(guid: string) {
    this.onDestroy.next(guid);
  }
}
