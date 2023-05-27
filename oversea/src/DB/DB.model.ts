import { Client } from 'ssh2';
import { createConnection } from 'mysql';
import CONFIG from '../../config';

export const dbModel = {
  sshClient: null,
  connection: null,
};

export async function init() {
  dbModel.sshClient = new Client();
  dbModel.sshClient.on('ready', () => {
    console.log('SSH connection established');

    // Forward a local port to the MySQL server
    dbModel.sshClient.forwardOut(
      // Source address, this can usually be any available local address
      'localhost',
      // Source port, this can be any available port number
      22,
      // Destination address (MySQL server)
      '15.164.171.244',
      // Destination port (MySQL server)
      3306,
      (err, stream) => {
        if (err) throw err;

        console.log('MySQL connection established');

        // Create a MySQL connection using the forwarded port
        dbModel.connection = createConnection({
          ...CONFIG.MYSQL,
        });

        dbModel.connection.connect((err) => {
          if (err) throw err;

          console.log('Connected to MySQL server');
        });
      },
    );
    dbModel.sshClient.connect(CONFIG.SSH);
  });

  await dbModel.connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database: ' + error.stack);
      return;
    }
    console.log(
      'Connected to MySQL database with connection ID ' +
        dbModel.connection.threadId,
    );
  });
  return;
}
