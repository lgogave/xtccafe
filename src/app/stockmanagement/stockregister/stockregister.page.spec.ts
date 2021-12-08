import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockregisterPage } from './stockregister.page';

describe('StockregisterPage', () => {
  let component: StockregisterPage;
  let fixture: ComponentFixture<StockregisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockregisterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockregisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
