import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddClientPage } from './add-client.page';

describe('AddClientPage', () => {
  let component: AddClientPage;
  let fixture: ComponentFixture<AddClientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClientPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
