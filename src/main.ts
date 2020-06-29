
import { casalClass } from './lib/casal'

class principal {

    run(){

        var casal: casalClass = new casalClass();
        
        casal.main()
            .then()
            .catch()
            ;
        
    };

};

var princ: principal = new principal();
princ.run();