import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-modal-editar-usuario',
  templateUrl: './modal-editar-usuario.page.html',
  styleUrls: ['./modal-editar-usuario.page.scss'],
})
export class ModalEditarUsuarioPage {
  @Input() usuarioId: string; // Cambiado
  @Input() usuario: any;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  async ngOnInit() {
    if (!this.usuario && this.usuarioId) {
      this.usuario = await this.obtenerUsuario(this.usuarioId);
    }
  }

  async obtenerUsuario(userId: string) {
    const userDocRef = this.firestore.collection('usuarios').doc(userId);
    const userDoc = await userDocRef.get().toPromise();
    return userDoc.exists ? userDoc.data() : null;
  }

  async guardarCambios() {
    try {
      if (this.usuario || this.usuarioId) {
        const userDocRef = this.firestore.collection('usuarios').doc(this.usuarioId);
        const docSnapshot = await userDocRef.get().toPromise();
  
        if (docSnapshot.exists) {
          await this.firestore.collection('usuarios').doc(this.usuarioId).update(this.usuario);
          this.modalController.dismiss({ actualizado: true });
        } else {
          console.error('El documento no existe en la base de datos.');
        }
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  }
  //** */

  cerrarModal() {
    this.modalController.dismiss();
  }

}

