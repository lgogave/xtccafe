import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PorequsitionlistPage } from './porequsitionlist.page';

describe('PorequsitionlistPage', () => {
  let component: PorequsitionlistPage;
  let fixture: ComponentFixture<PorequsitionlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorequsitionlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PorequsitionlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
