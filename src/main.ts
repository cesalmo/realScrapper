
import { casalClass } from './lib/casal';
import { ddbbClass  } from './lib/gestorDDBB'


class principalClass {

    run(){

        var casal: casalClass = new casalClass();
        var ddbb: ddbbClass = new ddbbClass();
        
        casal.main()
            .then( r => ddbb.casalInsert(r) )
            .catch()
            ;
        
    };

};

var princ: principalClass = new principalClass();
princ.run();