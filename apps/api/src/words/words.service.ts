import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as readline from 'readline';

@Injectable()
export class WordsService implements OnModuleInit {
  private filePath: string;
  private offsets: number[] = [];
  private totalLines = 0;

  async onModuleInit() {
    this.filePath = path.join(__dirname, '..', 'assets', 'wordlist.txt');
    await this.buildIndex();
  }

  private async buildIndex(): Promise<void> {
    const fileHandle = await fs.open(this.filePath, 'r');
    const stream = fileHandle.createReadStream();
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    this.offsets = [];
    let currentOffset = 0;

    for await (const line of rl) {
      this.offsets.push(currentOffset);
      currentOffset += Buffer.byteLength(line, 'utf-8') + 1;
    }

    rl.close();
    await fileHandle.close();

    this.totalLines = this.offsets.length;
    if (this.totalLines === 0) {
      throw new Error('File appears to be empty or unreadable');
    }
  }

  private async readLineByIndex(index: number): Promise<string> {
    if (index < 0 || index >= this.totalLines) {
      throw new Error(`Index ${index} out of range.`);
    }

    const offset = this.offsets[index];
    const fileHandle = await fs.open(this.filePath, 'r');

    const buffer = Buffer.alloc(1024);
    const { bytesRead } = await fileHandle.read(
      buffer,
      0,
      buffer.length,
      offset,
    );

    await fileHandle.close();

    const content = buffer.slice(0, bytesRead).toString('utf8');
    return content.split(/\r?\n/)[0] || '';
  }

  async generateWords(count = 12): Promise<string> {
    if (count > this.totalLines) {
      throw new Error(
        `Not enough lines in the file to get ${count} unique words.`,
      );
    }

    const allIndices = Array.from({ length: this.totalLines }, (_, i) => i);

    for (let i = this.totalLines - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
    }

    const chosenIndices = allIndices.slice(0, count);

    const words: string[] = [];
    for (const idx of chosenIndices) {
      const line = await this.readLineByIndex(idx);
      words.push(line);
    }

    return words.join(' ');
  }
}
