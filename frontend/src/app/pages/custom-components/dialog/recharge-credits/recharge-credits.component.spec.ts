import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeCreditsComponent } from './recharge-credits.component';

describe('RechargeCreditsComponent', () => {
  let component: RechargeCreditsComponent;
  let fixture: ComponentFixture<RechargeCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeCreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
