import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactProductListComponent } from './compact-product-list.component';

describe('CompactProductComponent', () => {
  let component: CompactProductListComponent;
  let fixture: ComponentFixture<CompactProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
