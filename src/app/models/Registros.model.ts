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


