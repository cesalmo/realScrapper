import Axios, { AxiosPromise } from 'axios';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { ePro, ts_ScrappedData } from './types'


export class casalClass {

    // get_casal(pag: number) : string {

    //     Axios({ 
    //             method: "get",
    //             url: "https://www.inmocasal.es/busqueda-avanzada/?accion=search&gesid=5&catid=6&id_poblacion=27&pagina=1",
    //             responseType: "stream"
    //         })
    //         .then(
    //             (response) => { response.data.pipe( fs.createWriteStream("./src/casal1.txt") ) },
    //             (reject) => { console.log('error casal' + '\n' + reject.data )} )
    //         .catch((error) => { console.log('excep. casal' + '\n' + error.data )});
    //     };


    /**
    * Recupera html de casal
    * @param pag - nº de pagina
    *  @returns promesa con el html en string
    *
    */
    async HttpGetCasal(pag: number): Promise<String> {

        var ls_url: string = "https://www.inmocasal.es/busqueda-avanzada/?accion=search&gesid=5&catid=6&id_poblacion=27&pagina=";
        var ls_url_final: string = ls_url + pag;

        // try {
        //     var ls_response = await Axios({
        //         method: "get",
        //         url: ls_url_final,
        //         responseType: "text"
        //     });
        // } catch (error) { return "" };

        // return ls_response.data;
        if ( pag != 12 ) {
       var response = await fs.promises.readFile('./src/casal1.txt')
        return response.toString();
        } else { return "" };
    };


    // async parsePagina() {
    /**
     * Interpreta y extrae datos de la pagina de casal
     * @param pagina Html en formato string
     * @returns array con los datos de la pagina
     */
    parsePagina(pagina: string): ts_ScrappedData[] {

        var lt_scrappedData: ts_ScrappedData[] = [];

        var $: CheerioStatic = cheerio.load(pagina.toString());
        var oDate = new Date();
        $('[id^=post]').each((i: number, t: CheerioElement): void => {
            var link = cheerio('figure > a', t).slice(0, 1).attr('href') as string; // -> "https://www.inmocasal.es/detalle-casa/?propiedad=11762"
            var precioCompleto = cheerio('figure  .property-price', t).slice(1, 2).text(); // -> 38.000€
            var precioString = precioCompleto.trim().split('€')[0];
            var precio = Number(precioString);
            var refCompleta = cheerio('.agent-property-desc label span', t).slice(1, 2).text() //-> " Ref.MI00002118"
            var ref = refCompleta.split('.')[1];
            var m2String = cheerio('.property-info-agent span', t).slice(0, 1).text();
            var m2 = Number(m2String);
            var numHabString = cheerio('.property-info-agent span', t).slice(1, 2).text();
            var numHab = Number(numHabString);
            var numBañoString = cheerio('.property-info-agent span', t).slice(2, 3).text();
            var numBaño = Number(numBañoString);
            var nMillsecsUTC = Date.now();
            // var nMillsecsUTC = oDate.getMilliseconds;
            var ls_scrappedData: ts_ScrappedData = {
                proveedor: ePro.casal,
                Ref: ref,
                millsecsUTC: nMillsecsUTC,
                link: link,
                precio: precio,
                m2: m2,
                hab: numHab,
                banios: numBaño
            };
            lt_scrappedData.push(ls_scrappedData);
        });
        // console.log(lt_scrappedData);
        return lt_scrappedData;
    };

    sleep(ms: number) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      };

    /**
     * Metodo de entrada
     * @returns nada
     */
    async main(): Promise<ts_ScrappedData[]> {
        var bContinue: boolean = true;
        var itCasaldataTotal: ts_ScrappedData[] = [];
        var nPagina: number = 11;

        while ( bContinue == true ){
        var sPagina: String = await this.HttpGetCasal(nPagina);
        var itCasalData: ts_ScrappedData[] = this.parsePagina(sPagina.toString());
        var itCasaldataTotal2 = itCasaldataTotal.concat(itCasalData);
        itCasaldataTotal = itCasaldataTotal2;
        await this.sleep(5000);
        itCasalData.length == 0 ? bContinue = false : bContinue = true;
        nPagina += 1;
        };

        // console.log(JSON.stringify(itCasaldataTotal, null, "   "));
          return itCasaldataTotal;
    };
};