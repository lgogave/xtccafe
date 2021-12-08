import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PorequsitionPage } from './porequsition.page';

describe('PorequsitionPage', () => {
  let component: PorequsitionPage;
  let fixture: ComponentFixture<PorequsitionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorequsitionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PorequsitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
