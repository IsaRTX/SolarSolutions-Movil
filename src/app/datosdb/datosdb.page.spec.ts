import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosdbPage } from './datosdb.page';

describe('DatosdbPage', () => {
  let component: DatosdbPage;
  let fixture: ComponentFixture<DatosdbPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosdbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
