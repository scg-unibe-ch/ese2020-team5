import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListingComponent } from './create-product.component';

describe('CreateListingComponent', () => {
  let component: CreateListingComponent;
  let fixture: ComponentFixture<CreateListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
