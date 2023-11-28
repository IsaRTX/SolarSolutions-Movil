//datos-usuario.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, DatosUsuario } from '../auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.page.html',
  styleUrls: ['./datos-usuario.page.scss'],
})
export class DatosUsuarioPage implements OnInit {
  uid: string;
  usuario: any;
  datos: any;
  datosUsuario: any[] = [];
  urlImagenes: string[] | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid');
    await this.obtenerDetallesUsuario();
    await this.obtenerDatosUsuario();
  }

  async obtenerDetallesUsuario() {
    try {
      this.usuario = await this.authService.obtenerDetallesUsuario(this.uid);
      console.log('Detalles del usuario:', this.usuario);

      this.urlImagenes = await this.obtenerURLTodasLasImagenes();

      if (!this.urlImagenes || this.urlImagenes.length === 0) {
        console.warn('No se encontraron imágenes asociadas al usuario.');
      }
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
    }
  }

  async obtenerURLTodasLasImagenes(): Promise<string[] | null> {
    try {
      const referenciaCarpeta = this.storage.ref(`imagenes/${this.uid}`);
      const listado = await referenciaCarpeta.listAll().toPromise();

      if (listado.items.length > 0) {
        const urls = await Promise.all(listado.items.map(async (imagen) => {
          return await imagen.getDownloadURL();
        }));

        console.log('Detalles de todas las imágenes:', urls);

        return urls;
      } else {
        console.warn('No se encontraron imágenes en la carpeta imagenes.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener URLs de las imágenes:', error);
      return null;
    }
  }

  async obtenerDatosUsuario() {
    try {
      this.datosUsuario = await this.authService.obtenerDatosUsuario(this.uid);
      console.log('Datos del usuario:', this.datosUsuario);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  }
}
