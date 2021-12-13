import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockbreakupPage } from './stockbreakup.page';

describe('StockbreakupPage', () => {
  let component: StockbreakupPage;
  let fixture: ComponentFixture<StockbreakupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockbreakupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockbreakupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
