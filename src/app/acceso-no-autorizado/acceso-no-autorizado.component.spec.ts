import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccesoNoAutorizadoComponent } from './acceso-no-autorizado.component';

describe('AccesoNoAutorizadoComponent', () => {
  let component: AccesoNoAutorizadoComponent;
  let fixture: ComponentFixture<AccesoNoAutorizadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesoNoAutorizadoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccesoNoAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
