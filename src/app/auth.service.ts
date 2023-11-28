import { Injectable, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

interface UserInfo {
  correoElectronico: string;
  nombre?: string;
  apellido?: string;
}
export interface DatosUsuario {
  uid: string;
  NombreEmpleado: string;
  nombreDelLugar: string;
  nombreNegocio: string;
  notas: string;
  socio: string;
  valor: number;
  imagenes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afs: AngularFirestore;
  constructor(
    @Inject(AngularFireAuth) private afAuth: AngularFireAuth,
    @Inject(AngularFirestore) private firestore: AngularFirestore,
    @Inject(AngularFireStorage) private storage: AngularFireStorage,
    private router: Router
    
  ) {}

  private async getCollection(queryFn: any): Promise<any> {
    const collection = this.firestore.collection('usuarios', queryFn);
    const querySnapshot = await collection.get().pipe(first()).toPromise();
    return querySnapshot?.docs ? (querySnapshot.docs as any) : [];
  }

async getUID(): Promise<string | null> {
  const user = await this.afAuth.currentUser;
  if (user){
    return user?.uid || null;
  } else { 
    return null
  }
}

async obtenerInformacionUsuarioConNombre(): Promise<UserInfo | null> {
  try {
    const uid = await this.getUID();
    console.log('UID en obtenerInformacionUsuarioConNombre:', uid);
    if (!uid) {
      console.log('UID es nulo en obtenerInformacionUsuarioConNombre');
      return null;
    }
    const userDocument = await this.firestore.collection('usuarios').doc(uid).get().toPromise();
    if (userDocument.exists) {
      const userData: any = userDocument.data() || {};
      console.log('Información del usuario obtenida correctamente:', userData);
      return { correoElectronico: userData.correoElectronico, nombre: userData.nombre, apellido: userData.apellido };
    } else {
      console.log('El documento no existe en obtenerInformacionUsuarioConNombre');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener información del usuario en obtenerInformacionUsuarioConNombre:', error);
    throw error;
  }
}


async obtenerInformacionUsuario(): Promise<any | null> {
  try {
    const uid = await this.getUID();
    if (uid) {
      const userDocument = await this.firestore.collection('usuarios').doc(uid).get().pipe(first()).toPromise();
      console.log('userDocument en obtenerInformacionUsuario:', userDocument);
      if (userDocument.exists) {
        const userData: any = userDocument.data() || {};
        console.log('userData en obtenerInformacionUsuario:', userData);
        return userData;
      } else {
        console.log('El documento no existe en obtenerInformacionUsuario');
        return null;
      }
    } else {
      console.log('UID es nulo en obtenerInformacionUsuario');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener información del usuario en obtenerInformacionUsuario:', error);
    return null;
  }
}
  async cerrarSesion(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
  async getCurrentUser(): Promise<any | null> {
    const user = await this.afAuth.currentUser;
    return user ? user : null;
  }
  
  async verificarCredenciales(credenciales: any): Promise<boolean> {
    try {
      await this.afAuth.signInWithEmailAndPassword(
        credenciales.correoElectronico,
        credenciales.password
      );

      const rol = await this.obtenerRolUsuario();

      if (rol === 'usuario') {
        this.router.navigate(['/menu']); // Redirigir al menú para usuarios
      } else if (rol === 'administrador') {
        this.router.navigate(['/admin']); // Redirigir a la página de administrador para administradores
      }

      return true;
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      return false;
    }
  }

  async registrarUsuario(usuario: any): Promise<void> {
    try {
      const credenciales = await this.afAuth.createUserWithEmailAndPassword(
        usuario.correoElectronico,
        usuario.password
      );
      console.log('Usuario registrado exitosamente:', credenciales.user);
      await this.firestore.collection('usuarios').doc(credenciales.user?.uid).set({
        uid: credenciales.user ? credenciales.user.uid : '',
        correoElectronico: usuario.correoElectronico,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: 'usuario',
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  async verificarEmailUnico(email: string): Promise<boolean> {
    try {
      const queryFn = (ref: any) => ref.where('correoElectronico', '==', email);
      const queryDocs = await this.getCollection(queryFn);
      return queryDocs.length === 0;
    } catch (error) {
      console.error('Error al verificar email único:', error);
      throw error;
    }
  }

  async obtenerUsuarioPorEmail(email: string): Promise<any | null> {
    try {
      const queryFn = (ref: any) => ref.where('correoElectronico', '==', email).limit(1);
      const queryDocs = await this.getCollection(queryFn);
      if (queryDocs.length > 0) {
        return queryDocs[0].data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      throw error;
    }
  }

  async obtenerRolUsuario(): Promise<string | null> {
    try {
      const uid = await this.getUID();
      if (!uid) {
        console.log('UID es nulo en obtenerRolUsuario');
        return null;
      }
      const userDocument = await this.firestore.collection('usuarios').doc(uid).get().toPromise();
      if (userDocument.exists) {
        const userData: any = userDocument.data() || {};
        console.log('Rol del usuario obtenido correctamente:', userData.rol);
        return userData.rol;
      } else {
        console.log('El documento no existe en obtenerRolUsuario');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      throw error;
    }
  }

  async verificarRolYRedirigir(rolesPermitidos: string[], rutaRedireccion: string) {
    const user = await this.afAuth.authState.pipe(first()).toPromise();

    if (user) {
      const userData = await this.afs.collection('usuarios').doc(user.uid).get().toPromise();
      const rol = userData.get('rol');

      if (rolesPermitidos.includes(rol)) {
        this.router.navigate([rutaRedireccion]);
      } else {
        console.warn('No tienes permisos para acceder a esta página.');
        // Redirige a una página de acceso no autorizado o a otra página según tu lógica.
        this.router.navigate(['/acceso-no-autorizado']);
      }
    } else {
      console.warn('Usuario no autenticado.');
      // Redirige a la página de inicio de sesión.
      this.router.navigate(['/login']);
    }
  }

 // empieza parte de admin
 async obtenerListaUsuarios(): Promise<any[]> {
  try {
    const snapshot = await this.firestore.collection('usuarios').get().toPromise();
    const usuarios = snapshot.docs.map(doc => doc.data()); // Mapear a los datos del documento
    console.log('Usuarios obtenidos:', usuarios);
    return usuarios;
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error);
    throw error;
  }
}

  async obtenerTodosUid(): Promise<string[]> {
    try {
      const querySnapshot = await this.firestore.collection('usuarios').get().toPromise();
      const uids = querySnapshot.docs.map(doc => doc.id);
      console.log('UIDs obtenidos:', uids);
      return uids;
    } catch (error) {
      console.error('Error al obtener los UID de usuarios:', error);
      throw error;
    }
  }
  navegarADatosUsuario(uid: string) {
    this.router.navigate(['/datos-usuario', uid]);
  }
  async obtenerDetallesUsuario(uid: string): Promise<any> {
    try {
      const userDocument = await this.firestore.collection('usuarios').doc(uid).get().toPromise();

      if (userDocument.exists) {
        const userData: any = userDocument.data() || {};
        return {
          uid: uid,
          nombreCompleto: userData.nombre + ' ' + userData.apellido,
        };
      } else {
        console.log('El documento no existe en obtenerDetallesUsuario');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
      throw error;
    }
  }
  
  async obtenerDatos(uid: string): Promise<DatosUsuario | null> {
    try {
      // Consultar la colección "datos" para encontrar el documento con el UID proporcionado
      const querySnapshot = await this.firestore.collection('datos', ref => ref.where('uid', '==', uid)).get().toPromise();

      if (!querySnapshot.empty) {
        // Obtener el primer documento encontrado
        const userData: any = querySnapshot.docs[0].data() || {};

        return {
          uid:userData.uid || '',
          NombreEmpleado: userData.NombreEmpleado || '',
          nombreDelLugar: userData.nombreDelLugar || '',
          nombreNegocio: userData.NombreNegocio || '',
          notas: userData.notas || '',
          socio: userData.socio || '',
          valor: userData.valor || '',
          imagenes: userData.imagenes || [],
          
        };
      } else {
        console.log('No se encontró ningún documento en obtenerDatos');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
      throw error;
    }
  }
  async enviarDatos(uid: string, datos: DatosUsuario): Promise<void> {
    try {
      const datosFirestore: any = {
        uid: uid,
        ...datos,
      };

      await this.firestore.collection('datos').add(datosFirestore);
    } catch (error) {
      console.error('Error al enviar datos a Firestore:', error);
      throw error;
    }
  }

  async obtenerDatosUsuario(uid: string): Promise<any[]> {
    try {
      const datosSnapshot = await this.firestore.collection('datos', ref => ref.where('uid', '==', uid)).get().toPromise();
      return datosSnapshot.docs.map(doc => {
        const data = doc.data() || {};
        return Object.assign({}, { id: doc.id }, data);
      });
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      throw error;
    }
  }
}
