import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosUsuarioPage } from './datos-usuario.page';

describe('DatosUsuarioPage', () => {
  let component: DatosUsuarioPage;
  let fixture: ComponentFixture<DatosUsuarioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
