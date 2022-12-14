import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

import { v4 as uuid } from 'uuid';
import { combineLatest, forkJoin, last, switchMap } from 'rxjs';

import { ClipService } from 'src/app/services/clip.service';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
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
  task?: AngularFireUploadTask
  screenshots: string[] = [];
  selectedScreenShot = '';
  screenshotTask?: AngularFireUploadTask

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe(
      (user) => this.user = user
    );
    this.ffmpegService.init();
  }

  uploadForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  });

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile(event: Event) {
    if(this.ffmpegService.isRunning) {
      return
    }

    this.isDragover = false;

    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null //drag and drop
      : (event.target as HTMLInputElement).files?.item(0) ?? null //file input

    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);

    this.selectedScreenShot = this.screenshots[0];
    
    this.uploadForm.controls.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );
      
    this.showVideoEditor = true;
    console.log(this.file)
  }

  async uploadFile() {
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your Clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenShot);
    const screenshotPath = `screenshots/${clipFileName}.png`;

    
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);
    const screenshotRef = this.storage.ref(screenshotPath);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe(
      (progress) => {
        const [clipProgress, screenshotProgress] = progress;

        if(!clipProgress || !screenshotProgress) {
          return
        }

        const total = clipProgress + screenshotProgress;

        this.percentage = total as number / 200;
      }
    );

    forkJoin([ 
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
      switchMap(() => forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls;

        const clip = {
          uid: this.user?.uid as string,
          diplayName: this.user?.displayName as string,
          title: this.uploadForm.value.title as string,
          fileName: `${clipFileName}.mp4`,
          url: clipURL as string,
          screenshotURL: screenshotURL as string,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        const clipDocumentRef = await this.clipsService.createClip(clip);

        this.alertColor = 'green'
        this.alertMsg = 'Success! Your clip is now ready to share with the world';
        this.showPercentage = false;

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocumentRef.id
          ]);
        }, 1000);
      },
      error: (error) => {
        this.uploadForm.enable();

        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please try again later.'
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error);
      }
    })
  }
}
