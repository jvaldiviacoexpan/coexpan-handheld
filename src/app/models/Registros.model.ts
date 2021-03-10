export class RegistrosModel {
  FechaScan: string;
  IdUsuario: number;
  CodBarras: string[];
}

export class EstadoIngresoModel {
  ESTADO: string;
  COD_BARRA: string;
  MESSAGE: string;
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
