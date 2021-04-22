export class RegistrosModel {
  CodBarras: string[];
  FechaScan: string;
  Bodega: number;
  IdUsuario: number;
}

export class EstadoIngresoModel {
  ESTADO: string;
  COD_BARRA: string;
  MESSAGE: string;
}

export class EstadoIngresoV2Model {
  CODBARRA: string;
  ESTADO: string;
  PROCESO: string;
  MENSAJE: string;
}

export class WsStatusV2Model
{
    ID: number;
    ID_SAP: number;
    MESSAGE: string;
    MESSAGE_SAP: string;
    STATUS: string;
    MESSAGE_EXCEPTION: string;
    MESSAGE_EXCEPTION_DESCR: string;
}

export class GetConsultaModel {
  Status: WsStatusV2Model;
  EstadoCodigos: EstadoIngresoModel[];
}

export class GetConsultaModelV2 <T> {
  Status: WsStatusV2Model;
  EstadoCodigos: T[];
}

export class ImprimirEtqMultipleZebraModel {
  IpZebra: string;
  CodBarra: string;
  CodBarraMulti: string;
}

export class GetRequestModel <T> {
  Status: WsStatusV2Model;
  Objeto: T;
}

export class IMPRESORAModel {
  NSERIAL: string;
  IP: string;
  PUERTO: number;
  IMP_NOMBRE: string;
  AVAILABLE: boolean;
  SECTOR: number;
  TAG_NOMBRE: string;
  TIPO_IMPRESORA: number;
}

export class ImpresoraPostModel {
  ipAddress: string;
}

export class PalletBobinasModel {
  Pallet: PalletModel;
  Bobinas: BobinaModel[];
}

export class BobinaModel {
  CODBAR_BOB: string;
  COD_PRODUCTO: string;
  NOM_PRODUCTO: string;
  MEDIDAS: string;
  PESO_BRUTO: number;
  PESO_NETO: number;
  ORDEN_FAB: string;
  NRO_BOBINA: number;
  CLIENTE: string;
  PRECIO_RESINA: number;
  VALOR_TOTAL: number;
  CODBAR_MULTI: string;
}

export class PalletModel {
  ID: number;
  NOM_PRODUCTO: string;
  CLIENTE: string;
  MEDIDAS: string;
  PESO_BRUTO: string;
  PESO_NETO: string;
  ORDEN_FAB: string;
  COD_PRODUCTO: string;
  CANT_BOB: string;
  CORRELATIVO: string;
  FECHA: string;
  HORA: string;
  CODBAR_MULTI: string;
}

export class LoginModel {
  user: string;
  password: string;
  companydb: string;
}

export class MessageModel {
  ID: number;
  ID_SAP: number;
  MESSAGE: string;
  MESSAGE_SAP: string;
  STATUS: string;
  MESSAGE_EXCEPTION: string;
  MESSAGE_EXCEPTION_DESCR: string;
  COUNT_ACOUNT_DISCONNECTED: number;
  TOKEN: string;
}

export class UserSapModel {
  User: string;
  Token: string;
}

export class SapPostModel<T> {
  objeto: T;
  usuario: string;
  token: string;
}

export interface StsPalletModel {
  CodBarra: string;
  Estado: string;
  Mensaje: string;
  SapId: number;
  SapMensaje: string;
  Exception: null;
}

//#region bp-etq-reimprimir.component MODEL
export class InfoEtiquetaModel {
  CodBobina: string;
  CodPallet: string;
}

export class ImpresoraEtiquetaPalletModel {
  IpZebra: string;
  Pallets: PalletModel[];
}
//#endregion

