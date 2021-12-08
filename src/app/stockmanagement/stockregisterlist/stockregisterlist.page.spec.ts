import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockregisterlistPage } from './stockregisterlist.page';

describe('StockregisterlistPage', () => {
  let component: StockregisterlistPage;
  let fixture: ComponentFixture<StockregisterlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockregisterlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockregisterlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
