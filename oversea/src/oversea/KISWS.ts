import config from 'config';
import { APIS } from './KISAPIS';
import { overseaModel } from './oversea.model';
import { makeWSdata } from './oversea.type';
import { WebSocket } from 'ws';
import { parseWSmessage } from './KISWSparsing';
import { HDFSCNT0 as HDFSCNT0_map } from './oversea.model';

const CONFIG = config.KIS_WS;

export const KISclients: {
  socket?: WebSocket;
  messageHandlers?: any;
} = {
  messageHandlers: {
    PINGPONG: {
      handle(e) {
        //console.log('PINGPONG : ' + e);
      },
    },
    HDFSCNT0: {
      sendAll() {
        for (const target of HDFSCNT0_map.target_clients.keys()) {
          KISclients.socket.send(
            JSON.stringify(
              makeWSdata({
                tr_id: config.KIS_WS.urls.해외주식_실시간지연체결가.tr_id,
                tr_key: target,
              }),
            ),
          );
        }
      },
      send(target: string) {
        KISclients.socket.send(
          JSON.stringify(
            makeWSdata({
              tr_id: config.KIS_WS.urls.해외주식_실시간지연체결가.tr_id,
              tr_key: target,
            }),
          ),
        );
      },
      handle({ header, body }) {
        HDFSCNT0_map.sendData(body.실시간종목코드, body);
        //console.log('HDFSCNT0 : ' + JSON.stringify(body, undefined, 2));
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
      KISclients.messageHandlers[header.tr_id].handle(
        parseWSmessage(e.toString('utf8')),
      );
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
    KISclients.socket = new WebSocket(CONFIG.real);
    for (let [event, func] of Object.entries(handlers)) {
      KISclients.socket.on(event, func);
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
