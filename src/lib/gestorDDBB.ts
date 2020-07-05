import * as cds from '@sap/cds';
import { ts_ScrappedData } from './types'

export class ddbbClass {

    constructor() { };
    /**
     * 
     * @param ts_ScrappedData Array con datos a insertar
     * 
     */
    async casalInsert(ts_ScrappedData: ts_ScrappedData[]) {
 
        cds.connect();

        var oRows = ts_ScrappedData.map(r => Object.values(r));

        var query2 = INSERT.into('zcam_realS')
            .columns('proveedor', 'Ref', 'millsecsUTC', 'link', 'precio', 'm2', 'hab', 'banios')
            .rows(oRows);
        var bresult = await cds.run(query2);
        if (!bresult || bresult == 0) {
            throw new Error("error DDBB casal")
        } 
        console.log(bresult);




    };


};