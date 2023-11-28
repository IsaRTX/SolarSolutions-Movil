import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { ModalEditarUsuarioPage } from '../modal-editar-usuario/modal-editar-usuario.page';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
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

  verDetallesUsuario(usuario: any) {
    // Puedes implementar la lógica aquí para mostrar detalles del usuario
    // Por ejemplo, navegar a otra página o mostrar los detalles en un modal
    this.navCtrl.navigateForward(`/detalles-usuario/${usuario.uid}`);
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
editarUsuario(usuario: any) {
  this.mostrarModalEditarUsuario(usuario);
}

editarCampo(campo: string, usuario: any) {
  this.mostrarAlertaEditarCampo(campo, usuario);
}

async mostrarModalEditarUsuario(usuario: any) {
  const modal = await this.modalController.create({
    component: ModalEditarUsuarioPage,
    componentProps: {
      usuario: usuario,
      usuarioId: usuario.uid, // Pasa el UID del usuario
    },
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) {
    console.log('Usuario editado:', data);
    // Actualiza la lista de usuarios u otras acciones necesarias
    this.obtenerListaUsuarios();
  }
}


async mostrarAlertaEditarCampo(campo: string, usuario: any) {
  const alert = await this.alertController.create({
    header: `Editar ${campo}`,
    inputs: [
      {
        name: 'nuevoValor',
        type: 'text',
        value: usuario[campo], // Establecer el valor actual del campo
        placeholder: `Nuevo ${campo}`,
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Guardar',
        handler: (data) => {
          console.log(`Nuevo valor para ${campo}:`, data.nuevoValor);
          // Aquí puedes actualizar el campo en la base de datos o realizar otras acciones necesarias
        },
      },
    ],
  });

  await alert.present();
}

 //menu-----------------------------------------------------------------------------------------------------------------------
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


