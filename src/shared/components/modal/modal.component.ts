import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
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
  public showcancel: any = 'true';

  @Input()
  public prevButton: any = 'false';

  @Input()
  public showCross: any = 'true';

  @Input()
  public modalDirection: string = '';

  @Input()
  public modalClass: string = '';

  constructor() {}

  ngOnInit(): void {}

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
}
