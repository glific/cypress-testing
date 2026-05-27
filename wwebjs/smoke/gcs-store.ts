import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';

export interface GCSStoreOptions {
  bucket: string;
  keyFilename?: string;
  prefix?: string;
  /** Must match RemoteAuth dataPath (default: ./.wwebjs_auth/) */
  dataPath?: string;
}

export interface StoreSessionParams {
  session: string;
  path?: string;
}

export class GCSRemoteAuthStore {
  private storage: Storage;
  private bucket: string;
  private prefix: string;
  private dataPath: string;

  constructor(options: GCSStoreOptions) {
    this.storage = new Storage(options.keyFilename ? { keyFilename: options.keyFilename } : {});
    this.bucket = options.bucket;
    this.prefix = options.prefix ?? 'whatsapp-sessions';
    this.dataPath = path.resolve(options.dataPath ?? './.wwebjs_auth');
  }

  /** RemoteAuth writes zips as {dataPath}/{session}.zip (e.g. RemoteAuth-production-sender.zip). */
  private localZipPath(session: string): string {
    return path.join(this.dataPath, `${session}.zip`);
  }

  private objectName(session: string): string {
    return `${this.prefix}/${session}.zip`;
  }

  async sessionExists({ session }: { session: string }): Promise<boolean> {
    console.log(`Checking if session exists: ${session}`);
    const [exists] = await this.storage.bucket(this.bucket).file(this.objectName(session)).exists();
    return exists;
  }

  async save({ session }: StoreSessionParams): Promise<void> {
    console.log(`Saving session: ${session}`);
    const localZip = this.localZipPath(session);
    if (!fs.existsSync(localZip)) {
      throw new Error(`Session zip not found at ${localZip}`);
    }
    await this.storage
      .bucket(this.bucket)
      .upload(localZip, { destination: this.objectName(session) });
    console.log(`Session saved to GCS: gs://${this.bucket}/${this.objectName(session)}`);
  }

  async extract({ session, path: destPath }: StoreSessionParams): Promise<void> {
    console.log(`Extracting session: ${session}`);
    const localZip = destPath ?? this.localZipPath(session);
    fs.mkdirSync(path.dirname(localZip), { recursive: true });
    await this.storage
      .bucket(this.bucket)
      .file(this.objectName(session))
      .download({ destination: localZip });
    console.log(`Session restored from GCS: gs://${this.bucket}/${this.objectName(session)}`);
  }

  async delete({ session }: { session: string }): Promise<void> {
    console.log(`Deleting session: ${session}`);
    try {
      await this.storage.bucket(this.bucket).file(this.objectName(session)).delete();
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code !== '404') throw err;
    }
    console.log(`Session deleted from GCS: ${this.objectName(session)}`);
  }
}
