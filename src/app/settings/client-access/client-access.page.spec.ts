import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientAccessPage } from './client-access.page';

describe('ClientAccessPage', () => {
  let component: ClientAccessPage;
  let fixture: ComponentFixture<ClientAccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
