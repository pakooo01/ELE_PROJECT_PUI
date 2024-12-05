import { Injectable } from '@angular/core';
import { Article } from '../app/interface/interface.module';
import { ArrowFunctionExpr } from '@angular/compiler';

// Usa `window.require` per accedere a Electron
declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  ipcRenderer: any;
  isElectron: boolean;

  constructor() {
    // Verifica se Electron è disponibile
    this.isElectron = !!(window && window.process && window.process.type);

    if (this.isElectron) {
      try {
        this.ipcRenderer = window.require('electron').ipcRenderer; // Inizializza ipcRenderer
      } catch (error) {
        console.error('Errore durante l\'inizializzazione di ipcRenderer:', error);
      }
    } else {
      console.warn('Electron non è disponibile nel contesto corrente.');
    }
  }

  // Funzione per inviare una notifica
  sendNotification(body: { title: string; message: string; callback?: () => void }): Promise<void> {
    if (this.isElectron && this.ipcRenderer) {
      this.ipcRenderer.invoke('show-notification', {
        title: body.title,
        message: body.message,
        callbackEvent: 'notification-clicked-answer',
      });

      return new Promise((resolve) => {
        this.ipcRenderer.once('notification-clicked', () => {
          resolve(); // Risolvi quando l'utente clicca sulla notifica
        });
      });
    } else {
      return Promise.reject('Not running in Electron environment');
    }
  }

  // Funzione per importare un articolo
  async importArticle(): Promise<Article> {
    const result: {article: Article; success: boolean} = 
    await this.ipcRenderer.invoke('import-article',)
    return result.article
  }

  exportArticle(article: any): Promise<any> {
    if (this.isElectron && this.ipcRenderer) {
      return this.ipcRenderer.invoke('export-article', article);  // Invia la richiesta al processo principale
    } else {
      console.log(article)
      return Promise.reject('Electron non è disponibile o ipcRenderer non è inizializzato.');
    }
  }


  
}
