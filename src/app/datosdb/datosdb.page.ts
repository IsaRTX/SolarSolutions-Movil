import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-datosdb',
  templateUrl: './datosdb.page.html',
  styleUrls: ['./datosdb.page.scss'],
})
export class DatosdbPage implements OnInit {
  usuarios: any[] = [];
  uids: string[] = [];

  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.obtenerListaUsuarios();
    this.obtenerTodosUid();
  }

  async obtenerTodosUid() {
    try {
      this.uids = await this.authService.obtenerTodosUid();
      // Forzamos la detección de cambios después de obtener los UID
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener los UID en AdminPage:', error);
    }
  }

  async obtenerListaUsuarios() {
    try {
      this.usuarios = await this.authService.obtenerListaUsuarios();
      console.log('Usuarios en AdminPage:', this.usuarios);
    } catch (error) {
      console.error('Error al obtener la lista de usuarios en AdminPage:', error);
    }
  }

  irADatosUsuario(uid: string) {
    this.authService.navegarADatosUsuario(uid);
  }

  //menu
  async openMenu() {
    await this.menuController.open('start');
  }

  irACredenciales() {
    this.menuController.close();
    this.navCtrl.navigateForward('/admin'); // Redirige a la página "admin.html"
  }

  irADatos() {
    this.menuController.close();
    this.navCtrl.navigateForward('/datosdb'); // Redirige a la página "datosdb.html"
  }

  async confirmarCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.menuController.close(); // Cierra el menú antes de ejecutar la lógica de cerrar sesión
            this.cerrarSesion();
          },
        },
      ],
    });
  
    await alert.present();
  }
  

  async cerrarSesion() {
    try {
      await this.authService.cerrarSesion();
      this.navCtrl.navigateRoot('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
