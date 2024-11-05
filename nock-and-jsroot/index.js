import { openFile } from 'jsroot';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';

/**
 * Function to setup NOCK for downloading ROOT file with a mock HTTP request
 */
async function setupNock() {
  // Define the file path of ROOT object to return
  const filePath = path.resolve('mock-data/TObject_1645440261385.root');
  
  // Read the content of the file either as a string or as a stream
  const fileContent = await fs.readFile(filePath);

  nock('http://localhost:8081')
  .persist()
  .get('/download/016fa8ac-f3b6-11ec-b9a9-c0a80209250c')
  .reply(200, fileContent, {
    Date: 'Wed, 23 Mar 2022 14:17:41 GMT',
    Server: 'Nock',
    'Accept- Ranges': 'bytes',
    'Content-MD5': '09d5824764262824a89457c29cd473fe',
    'Content-Type': 'application/octet-stream',
    'Content-Length': '4096',
    'Keep-Alive': 'timeout=5, max=99',
    Connection: 'Keep-Alive',
    'Content-Disposition': 'inline;filename="TObject_1645440261385.root"',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'range',
    'Access-Control-Expose-Headers': 'content-range,content-length,accept-ranges',
    'Access-Control-Allow-Methods': 'HEAD, GET',
  });
}

async function main() {
  // Setup NOCK for mocking the HTTP request
  await setupNock();

  try {
    // Open the ROOT file from the server
    const file = await openFile('http://localhost:8081/download/016fa8ac-f3b6-11ec-b9a9-c0a80209250c+');
    console.log('SUCCESS: File opened successfully');
  } catch (error) {
    console.error('ERROR: Failed to open the file');
    console.trace(error);
  }
}

main();
