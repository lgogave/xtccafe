import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddClientAccessPage } from './add-client-access.page';

describe('AddClientAccessPage', () => {
  let component: AddClientAccessPage;
  let fixture: ComponentFixture<AddClientAccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClientAccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddClientAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
