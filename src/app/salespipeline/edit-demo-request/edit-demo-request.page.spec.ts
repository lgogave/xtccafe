import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditDemoRequestPage } from './edit-demo-request.page';

describe('EditDemoRequestPage', () => {
  let component: EditDemoRequestPage;
  let fixture: ComponentFixture<EditDemoRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDemoRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDemoRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
