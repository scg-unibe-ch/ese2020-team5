import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactProductCardComponent } from './compact-product-card.component';

describe('CompactProductCardComponent', () => {
  let component: CompactProductCardComponent;
  let fixture: ComponentFixture<CompactProductCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactProductCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
