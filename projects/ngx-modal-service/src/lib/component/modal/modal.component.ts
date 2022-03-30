import { AfterContentChecked, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { ModalEventsService } from '../../services/modal-events.service';
import { ViewController } from '../../utils';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { Observable, Subscription } from 'rxjs';
import { ModalResponse } from '../../types/modal.types';

@Component({
  selector: 'modal',
  styleUrls: ['./modal.component.scss'],
  templateUrl: './modal.component.html',
})

export class ModalComponent implements AfterContentChecked, OnInit {

  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild(BackdropComponent) backdrop: BackdropComponent;

  private readonly GUID: string;
  private subscription: Subscription;

  constructor(private renderer: Renderer2,
              private modalEventsService: ModalEventsService,
              private viewCtrl: ViewController) {
    this.GUID = this.viewCtrl.GUID;
  }

  private _options: any;

  set options(op: any) {
    this._options = op;
  }

  get onDismiss(): Observable<ModalResponse> {
    return new Observable<ModalResponse>((resolve) => {
      this.subscription = this.modalEventsService.onDismiss.subscribe((result) => {
        if (result.guid === this.GUID) {
          resolve.next(result.data);
          this.modalEventsService.destroy(this.GUID);
        }
      });
    });
  }

  ngOnInit(): void {
    this.backdrop.setIndex(this._options.index - 1);

    if (!this._options.backdrop) {
      this.backdrop.setBackgroundColor('transparent');
    }
  }

  ngAfterContentChecked() {
    const options = this._options;
    const height = options.height + 'px';
    const width = options.width + 'px';

    if (options.maxHeight) {
      this.renderer.setStyle(this.wrapper.nativeElement, 'max-height', options.maxHeight + 'px');
    } else {
      this.renderer.setStyle(this.wrapper.nativeElement, 'height', height);
    }

    this.renderer.setStyle(this.wrapper.nativeElement, 'width', width);
    this.renderer.setStyle(this.wrapper.nativeElement, 'z-index', options.index);

    //position modal.
    if (options.bottom || options.top || options.left || options.right) {

      if (options.bottom) {
        this.renderer.setStyle(this.wrapper.nativeElement, 'bottom', options.bottom + 'px');
      }

      if (options.top) {
        this.renderer.setStyle(this.wrapper.nativeElement, 'top', options.top + 'px');
      }

      if (options.left) {
        this.renderer.setStyle(this.wrapper.nativeElement, 'left', options.left + 'px');
      }

      if (options.right) {
        this.renderer.setStyle(this.wrapper.nativeElement, 'right', options.right + 'px');
      }

    } else {
      // default to center
      this.renderer.setStyle(this.wrapper.nativeElement, 'bottom', 'calc(50% - (' + height + '/2))');
      this.renderer.setStyle(this.wrapper.nativeElement, 'left', 'calc(50% - (' + width + '/2))');
    }

    if (options.borderColor) {
      this.renderer.setStyle(this.wrapper.nativeElement, 'border-color', options.borderColor);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onBackdropClick() {
    if (this._options.backdropDismiss && !document.body.classList.contains('lock-modal')) {
      this.dismiss();
    }
  }

  dismiss(data = null) {
    this.modalEventsService.dismiss(this.GUID, {
      success: false,
      result: data,
    });
  }

}
