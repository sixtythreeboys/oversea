import config from 'config';
import { APIS } from './KISAPIS';
import { overseaModel } from './oversea.model';
import { makeWSdata } from './oversea.type';
import { WebSocket } from 'ws';

const CONFIG = config.KIS_WS;

export const clients: {
  socket?: WebSocket;
  messageHandlers?: any;
} = {
  messageHandlers: {
    PINGPONG(e) {
      console.log('PINGPONG : ' + e);
    },
    HDFSCNT0(e) {
      console.log('HDFSCNT0 : ' + e);
    },
  },
};

export async function init() {
  const handlers = {
    close(e) {
      console.log('ws closed : ' + e);
      init();
    },
    error(e) {
      console.log('ws error : ' + e);
    },
    message(e) {
      //const message = e.toString('utf8');
      //console.log(message);
      console.log('recv ws msg : ' + JSON.stringify(JSON.parse(e), null, 2));
      const { header } = JSON.parse(e);
      try {
        //clients.messageHandlers[header.tr_id](e);
      } catch (err) {
        console.log('fail to handle ws message : ' + err);
      }
    },
    open() {
      console.log('ws opened');
      clients.socket.send(
        JSON.stringify(
          makeWSdata({
            tr_id: 'HDFSCNT0',
            tr_key: 'DNASAAPL',
          }),
        ),
      );
      clients.socket.send(
        JSON.stringify(
          makeWSdata({
            tr_id: 'HDFSCNT0',
            tr_key: 'DHKS00003',
          }),
        ),
      );
    },
  };
  try {
    const res = await APIS.oauth2Approval();
    overseaModel.approval_key = res.data.approval_key;
    clients.socket = new WebSocket(CONFIG.real);
    for (let [event, func] of Object.entries(handlers)) {
      clients.socket.on(event, func);
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
