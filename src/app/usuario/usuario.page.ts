import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

interface UserInfo {
  correoElectronico: string;
  nombre?: string;
  apellido?: string;
  uid?: string;
  rol?: string;
  // Agrega otros campos según sea necesario
}


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  imagenPerfil: string = 'assets/default-profile-image.png';
  nombreCompleto: string = '';
  correoElectronico: string = '';
  editMode: boolean = false;

  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

ngOnInit() {
  this.authService.getCurrentUser().then(user => {
    if (user) {
      this.obtenerInformacionUsuario();
    } else {
      this.navCtrl.navigateRoot('/login');
    }
  });
}

  async obtenerInformacionUsuario() {
    this.authService.obtenerInformacionUsuarioConNombre().then(userInfo => {
      if (userInfo) {
        console.log('Información del usuario:', userInfo);
        this.correoElectronico = userInfo.correoElectronico || '';
        this.nombreCompleto = this.formatNombreCompleto(userInfo.nombre, userInfo.apellido);
      } else {
        console.error('La información del usuario no está disponible.');
      }
    }).catch(error => {
      console.error('Error al obtener información del usuario en UsuarioPage:', error);
    });
  }
  

  formatNombreCompleto(nombre: string | undefined, apellido: string | undefined): string {
    return `${nombre || ''} ${apellido || ''}`;
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
          this.menuController.close();
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

