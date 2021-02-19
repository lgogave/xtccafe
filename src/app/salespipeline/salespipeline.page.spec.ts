import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalespipelinePage } from './salespipeline.page';

describe('SalespipelinePage', () => {
  let component: SalespipelinePage;
  let fixture: ComponentFixture<SalespipelinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalespipelinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalespipelinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
