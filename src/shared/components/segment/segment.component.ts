import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent {
  @Output() addSegment: EventEmitter<any> = new EventEmitter();
  @Output() cancelSegment: EventEmitter<any> = new EventEmitter();
  segmentForm: FormGroup;
  selectedList: string;
  listOptions: any[] = [
    { id: 1, value: 'Segment List' },
    { id: 2, value: 'Campaign List' },
  ];
  campaignList: any[] = [
    { id: 'camp1', name: 'campaign1' },
    { id: 'camp2', name: 'campaign2' },
  ];
  segmentList: any[] = [
    { id: 'seg1', name: 'segment1' },
    { id: 'seg2', name: 'segment2' },
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.renderSegmentForm();
    console.log(this.segmentForm.valid);
  }

  renderSegmentForm = (): void => {
    this.segmentForm = this.fb.group({
      sources: ['', Validators.required],
      campaignList: [''],
      segmentList: [''],
      list: ['', Validators.required],
    });
  };

  onListOptionsChange(e) {
    this.selectedList = e;
    console.log(e, this.selectedList);
  }

  onSegmentFormSubmit = (): void => {
    const { sources, list } = this.segmentForm.value;

    sources == 'Segment List'
      ? this.segmentForm.patchValue({ segmentList: list, campaignList: '' })
      : this.segmentForm.patchValue({ segmentList: '', campaignList: list });

    console.log('Segment Form works!!', this.segmentForm.value);
    this.addSegment.emit(this.segmentForm.value);
  };

  onCancel = (): void => {
    this.cancelSegment.emit();
  };
}
