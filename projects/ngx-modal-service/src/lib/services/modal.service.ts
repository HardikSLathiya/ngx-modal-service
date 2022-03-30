import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { ModalEventsService } from './modal-events.service';
import { ModalComponent } from '../component/modal/modal.component';
import { ModalOptions } from '../types/modal.types';
import { getProviders } from '../utils/provider';
import { ModalContainerComponent } from '../component/modal-container/modal-container.component';

@Injectable()
export class ModalService {

  private renderer: Renderer2;
  private count = {} as { [key: string]: ComponentRef<ModalComponent> };

  constructor(private readonly compFactoryResolver: ComponentFactoryResolver,
              private readonly appRef: ApplicationRef,
              private readonly injector: Injector,
              private readonly rendererFactory: RendererFactory2,
              private readonly modalEventsService: ModalEventsService) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.modalEventsService.onDestroy.subscribe((guid) => {
      const modal = this.count[guid];
      modal.destroy();

      delete this.count[guid];

      if (Object.keys(this.count).length == 0) {
        this.renderer.removeClass(document.body, 'modal-open');
      }
    });
  }

  showModal(component: any, data: { [key: string]: any } = {}, options: ModalOptions = {}) {
    // set default options in case not available
    options = {
      height: 500,
      width: 500,
      index: 9000 + Object.keys(this.count).length + 10,
      backdrop: true,
      backdropDismiss: true,
      ...options,
    };

    const GUID = this.createGuid();
    const factory = this.compFactoryResolver.resolveComponentFactory(component);
    const childInjector = Injector.create({
      providers: getProviders(GUID, data),
      parent: this.injector,
    });
    const componentRef = factory.create(childInjector);

    this.appRef.attachView(componentRef.hostView);

    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    const container = this.checkWrapper();
    const modal = this.createModal(options, childInjector);

    this.count[GUID.toString()] = modal;

    const modalEl = this.getHTMLElement(modal);
    const wrapperContents = modalEl.querySelector('.modal-wrapper');

    this.renderer.appendChild(wrapperContents, domElement);
    this.renderer.appendChild(container, modalEl);

    this.renderer.addClass(document.body, 'modal-open');

    return modal.instance;
  }

  private createModal(options: any, childInjector: Injector) {
    const factory = this.compFactoryResolver.resolveComponentFactory(ModalComponent);
    const componentRef = factory.create(childInjector);

    componentRef.instance.options = options;
    this.appRef.attachView(componentRef.hostView);
    return componentRef;
  }

  private checkWrapper() {
    const root = this.getHTMLElement(this.appRef.components[0]).localName;
    // noinspection TypeScriptValidateTypes
    let container = document.body.querySelector(root).querySelector('modal-container');

    if (container) {
      return container;
    }

    const factory = this.compFactoryResolver.resolveComponentFactory(ModalContainerComponent);
    const componentRef = factory.create(this.injector);

    this.appRef.attachView(componentRef.hostView);

    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    this.renderer.appendChild(document.body.querySelector(root), domElement);

    return domElement;
  }

  private createGuid(): string {
    return ('' + [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, ch => {
        let c = Number(ch);
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      },
    );
  }

  private getHTMLElement(componentRef: any) {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }

}
