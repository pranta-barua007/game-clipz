import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';

import { ClipService } from 'src/app/services/clip.service';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  isDragover = false;
  file: File | null = null;
  showVideoEditor = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your Clip is being uploaded';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;


  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService
  ) {
    auth.user.subscribe(
      (user) => this.user = user
    );
  }

  uploadForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  });

  storeFile(event: Event) {
    this.isDragover = false;

    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.showVideoEditor = true;

    this.uploadForm.controls.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );

    console.log(this.file)
  }

  uploadFile() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your Clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    
    task.percentageChanges().subscribe(
      (progress) => {
        this.percentage = progress as number / 100
      }
    );

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          diplayName: this.user?.displayName as string,
          title: this.uploadForm.value.title as string,
          fileName: `${clipFileName}.mp4`,
          url: url as string
        };

        console.log(clip);
        this.clipsService.createClip(clip);

        this.alertColor = 'green'
        this.alertMsg = 'Success! Your clip is now ready to share with the world';
        this.showPercentage = false;
      },
      error: (error) => {
        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please try again later.'
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error)
      }
    })
  }
}
