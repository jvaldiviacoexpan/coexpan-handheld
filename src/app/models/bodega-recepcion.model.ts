export class PalletBodegaRecepcionModel {
    ipAddress: string;
    modelData: ModelData;
    zplData:   string;
}

export class ModelData {
    fecha:         string;
    hora:          string;
    descrProducto: string;
    codProducto:   string;
    ordenFab:      string;
    cliente:       string;
    medidas:       string;
    cantBobina:    string;
    corrPallet:    string;
    pesoBruto:     string;
    pesoNeto:      string;
}
