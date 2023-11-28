import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditarUsuarioPage } from './modal-editar-usuario.page';

describe('ModalEditarUsuarioPage', () => {
  let component: ModalEditarUsuarioPage;
  let fixture: ComponentFixture<ModalEditarUsuarioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalEditarUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
