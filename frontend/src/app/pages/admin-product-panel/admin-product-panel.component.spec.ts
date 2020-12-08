import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductPanelComponent } from './admin-product-panel.component';

describe('AdminProductPanelComponent', () => {
  let component: AdminProductPanelComponent;
  let fixture: ComponentFixture<AdminProductPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
