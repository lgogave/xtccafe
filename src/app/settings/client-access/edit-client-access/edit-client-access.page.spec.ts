import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditClientAccessPage } from './edit-client-access.page';

describe('EditClientAccessPage', () => {
  let component: EditClientAccessPage;
  let fixture: ComponentFixture<EditClientAccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClientAccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditClientAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
