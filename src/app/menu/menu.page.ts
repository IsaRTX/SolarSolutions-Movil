import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController, NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService , DatosUsuario} from '../auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss'],
})
export class MenuPage {
  toggleValue: boolean = false;
  images: string[] = [];
  mensajeExito: string = '';
  mensajeError: string = '';
  mostrarExito: boolean = false;
  mostrarError: boolean = false;
  latitude: number | undefined;
  longitude: number | undefined;
  nombreDelLugar: string | undefined;
  nombreNegocio: string = '';
  valor: number = 0;
  notas: string = '';
  NombreEmpleado: string = '';
  selectedSocio: string | undefined;

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
  ) {
    this.nombreDelLugar = '';
    this.images = [];
    this.mostrarExito = false;
    this.mostrarError = false;
  }

  async enviarDatos() {
    const loading = await this.loadingController.create({
      message: 'Enviando datos...',
      spinner: 'crescent', 
      translucent: true,
      backdropDismiss: false, 
    });
  
    try {
      await loading.present();
  
      if (!this.validarDatos()) {
        this.mensajeError = 'Rellene los campos obligatorios y agregue al menos una imagen de la boleta o factura.';
        this.mostrarExito = false;
        this.mostrarError = true;
      } else {
        const uid = await this.authService.getUID();
  
        if (uid !== null) {
          const imagenesURL = await this.subirImagenes(uid);
          const fechaActual = new Date(); // Obtener la fecha actual
  
          const datosFirestore: any = {
            uid: uid,
            nombreNegocio: this.nombreNegocio,
            valor: this.valor,
            nombreDelLugar: this.nombreDelLugar,
            notas: this.notas,
            imagenes: imagenesURL,
            fecha: fechaActual.toISOString(), // Convertir la fecha a formato de cadena
            ...(this.selectedSocio && { socio: this.selectedSocio }),
            NombreEmpleado: this.NombreEmpleado,
          };
  
          await this.firestore.collection('datos').add(datosFirestore);
          this.mensajeExito = 'Datos enviados correctamente.';
          this.limpiarCampos();
        } else {
          console.error('UID es nulo');
        }
      }
    } catch (error) {
      console.error('Error al enviar datos a Firestore:', error);
      this.mensajeError = 'Error al enviar datos a Firestore: ' + error;
      this.mostrarExito = false;
      this.mostrarError = true;
    } finally {
      await loading.dismiss();
    }
  }
  
  

  navigateToUserPage() {
    this.navCtrl.navigateForward('usuario');
  }
  toggleChange() {
    this.toggleValue = !this.toggleValue;
  }
  async abrirCamara() {
    const permissions = await Camera.requestPermissions();
    if (permissions.camera === 'granted') {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
        })
        const imageUrl = image?.dataUrl ?? '';
        if (imageUrl) {
          this.images.push(imageUrl);
        }
      } catch (error) {
        console.error('Error al abrir la cámara:', error);
        // Manejar el error de la cámara de manera específica
      }
    } else {
      console.warn('Permiso de cámara denegado');
      // Manejar el caso cuando se deniega el permiso de la cámara
    }
  }

  getImageName(imageUrl: string): string {
    const parts = imageUrl.split('/');
    return parts[parts.length - 1];
  }

  eliminarImagen(index: number): void {
    this.images.splice(index, 1);
  }

  async agregarImagen(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            const imageUrl = e.target.result as string;
            this.images.push(imageUrl);
          } else {
            console.error('Error al leer el archivo.');
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Seleccione una imagen válida.');
      }
    }
  }

  async obtenerUbicacion() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
  }

  async obtenerUbicacionActual(): Promise<{ latitude: number, longitude: number }> {
    const coordinates = await Geolocation.getCurrentPosition();
    const latitude = coordinates.coords.latitude;
    const longitude = coordinates.coords.longitude;
    return { latitude, longitude };
  }

  async getPlaceName(latitude: number, longitude: number, apiKey: string): Promise<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const placeName = data.results[0].formatted_address;
        return placeName;
      } else {
        return 'No se pudo obtener la información del lugar.';
      }
    } catch (error) {
      console.error('Error al obtener información del lugar: ' + error);
      return 'Error al obtener información del lugar.';
    }
  }

  async obtenerNombreLugar() {
    const apiKey = 'AIzaSyCShFjh1lVUwXAzJyQw_ylR05tn0sbOK74';
    const coordinates = await this.obtenerUbicacionActual();
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      this.nombreDelLugar = await this.getPlaceName(latitude, longitude, apiKey);
    }
  }

  private validarDatos(): boolean {
    return (
      !!this.nombreDelLugar &&
      !!this.nombreNegocio &&
      this.valor > 0 &&
      this.images.length > 0
    );
  }

  private async subirImagenes(uid: string): Promise<string[]> {
    const imagenesURL: string[] = [];

    // Iterar sobre las imágenes y subirlas una por una
    for (const image of this.images) {
      const filePath = `imagenes/${uid}/${new Date().getTime()}_${this.getImageName(image)}`;
      const storageRef = this.storage.ref(filePath);

      try {
        // Convertir la imagen a un Blob
        const imageBlob = this.dataURLtoBlob(image);

        // Subir el Blob a Storage
        const uploadTask = this.storage.upload(filePath, imageBlob);

        // Esperar a que la tarea de carga se complete
        const snapshot = await uploadTask.snapshotChanges().pipe(
          finalize(() => {
            // Obtener la URL de descarga de la imagen subida
            storageRef.getDownloadURL().subscribe((url) => {
              imagenesURL.push(url);
            });
          })
        ).toPromise();
      } catch (error) {
        console.error('Error al subir imagen a Firebase Storage:', error);
      }
    }

    return imagenesURL;
  }

  // Convertir una Data URL a Blob
  private dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ab], { type: mimeString });
  }

  private limpiarCampos(): void {
    this.nombreDelLugar = '';
    this.nombreNegocio = '';
    this.notas = '';
    this.valor = 0;
    this.images = [];
    this.toggleValue = false;
    this.selectedSocio = undefined;
    this.NombreEmpleado = '';

    setTimeout(() => {
      this.mensajeExito = '';
      this.mensajeError = '';
      this.mostrarExito = false;
      this.mostrarError = false;
    }, 3000);
  }
}
