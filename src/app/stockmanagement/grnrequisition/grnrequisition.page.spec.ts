import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrnrequisitionPage } from './grnrequisition.page';

describe('GrnrequisitionPage', () => {
  let component: GrnrequisitionPage;
  let fixture: ComponentFixture<GrnrequisitionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnrequisitionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrnrequisitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
