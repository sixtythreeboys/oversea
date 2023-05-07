import config from 'config';
import { APIS } from './KISAPIS';
import { overseaModel } from './oversea.model';
import { makeWSdata } from './oversea.type';
import { WebSocket } from 'ws';
import { parseWSmessage } from './KISWSparsing';

const CONFIG = config.KIS_WS;

const clients: {
  socket?: WebSocket;
  messageHandlers?: any;
} = {
  messageHandlers: {
    PINGPONG: {
      handle(e) {
        console.log('PINGPONG : ' + e);
      },
    },
    HDFSCNT0: {
      targets: [],
      add(target) {
        this.targets.push(target);
        clients.socket.send(
          JSON.stringify(
            makeWSdata({
              tr_id: config.KIS_WS.urls.해외주식_실시간지연체결가.tr_id,
              tr_key: target,
            }),
          ),
        );
      },
      send() {
        for (const target of this.targets) {
          clients.socket.send(
            JSON.stringify(
              makeWSdata({
                tr_id: config.KIS_WS.urls.해외주식_실시간지연체결가.tr_id,
                tr_key: target,
              }),
            ),
          );
        }
      },
      handle(e) {
        console.log('HDFSCNT0 : ' + e);
      },
    },
  },
};

const handlers = {
  close(e) {
    console.log('KIS ws closed : ' + e);
    init();
  },
  error(e) {
    console.log('KIS ws error : ' + e);
  },
  message(e) {
    const { header, body } = parseWSmessage(e.toString('utf8'));
    try {
      clients.messageHandlers[header.tr_id].handle(e);
    } catch (err) {
      console.log('fail to handle KIS ws message : ' + err);
    }
  },
  open() {
    console.log('KIS ws opened');
  },
};

export async function init() {
  try {
    const res = await APIS.oauth2Approval();
    overseaModel.approval_key = res.data.approval_key;
    clients.socket = new WebSocket(CONFIG.real);
    for (let [event, func] of Object.entries(handlers)) {
      clients.socket.on(event, func);
    }
    //clients.messageHandlers.HDFSCNT0.add('DNASAAPL');
  } catch (error) {
    console.log(error);
    return error;
  }
}
