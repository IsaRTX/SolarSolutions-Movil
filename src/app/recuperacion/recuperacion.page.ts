// recuperacion.page.ts
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperacion',
  templateUrl: 'recuperacion.page.html',
  styleUrls: ['recuperacion.page.scss'],
})
export class RecuperacionPage {
  correoRecuperacion = '';

  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async enviarCorreoRecuperacionContrasena() {
    try {
      await this.afAuth.sendPasswordResetEmail(this.correoRecuperacion);
      await this.mostrarAlertaExito();
    } catch (error) {
      console.error('Error al enviar el correo de recuperación de contraseña:', error);
      await this.mostrarAlertaError();
    }
  }

  async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Se ha enviado un enlace de restablecimiento de contraseña a su correo electrónico.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('/login');
          },
        },
      ],
    });

    await alert.present();
  }

  async mostrarAlertaError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un problema al enviar el enlace de restablecimiento de contraseña. Por favor, inténtelo de nuevo.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
