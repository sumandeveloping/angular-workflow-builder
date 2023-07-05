import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('modalElement')
  modal: ElementRef;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() navToPrevPage = new EventEmitter();

  @Input()
  public backdrop: any = true;

  @Input()
  public modalTitle: string;

  @Input()
  public submitLabel: string;

  @Input()
  public prevButtonLabel: string;

  @Input()
  public showFooter: any;

  @Input()
  public showSave: any = 'true';

  @Input()
  public disableSave: any = 'false';

  @Input()
  public showcancel: any = 'true';

  @Input()
  public prevButton: any = 'false';

  @Input()
  public showCross: any = 'true';

  @Input()
  public modalDirection: string = '';

  @Input()
  public modalClass: string = '';

  constructor(private renderer2: Renderer2) {}

  ngOnInit(): void {}

  private unlistener: () => void;

  ngAfterViewInit(): void {
    this.unlistener = this.renderer2.listen(
      this.modal.nativeElement,
      'hidden.bs.modal',
      this.onHiddenModal
    );
  }

  onHiddenModal(e: any) {
    document.getElementById('closeModal').click();
  }

  showModal = () => {
    document.getElementById('openModalButton').click();
  };

  closeModal = () => {
    document.getElementById('closeModal')
      ? document.getElementById('closeModal').click()
      : null;
  };

  saveClicked = () => {
    this.save.emit(true);
  };

  closeClicked = () => {
    this.close.emit(true);
  };

  navToPrevClicked = () => {
    this.navToPrevPage.emit(true);
  };

  ngOnDestroy(): void {
    this.unlistener();
  }
}
