( function(){
    BarcodeReader = {
        RLE : function( x ){
            var last = x[0]
            var count = 1

            var rle = []

            for ( var i = 1; i < x.length; i++ ){
                if ( x[i] == last ){
                    count++
                }
                else {
                    last = x[i]
                    rle.push( count )
                    count = 1
                }
            }
            rle.push( count )

            return rle

        },

        detectGuards : function( x ){
            var guards = []

            var min, max, avg

            for ( var i = 0; i < x.length; i++ ){
                var subseq = x.slice( i, i+5 );
                if ( subseq.length < 5 ) continue;
                max = Math.max.apply( null, subseq );
                min = Math.min.apply( null, subseq );
//                console.log( "i=", i, "subseq=", subseq.join(), "minmax", [min,max].join() );
                if ( max/min < 1.5 ){
                    guards.push( i );
                }
            }

            return guards;
        },

        resample : function( x, unit ){
            var realunit = unit
            var resampled = []

            console.log(x,unit)

            for ( var i = 0; i < x.length; i++ ){
                var newlen, newunit;
                newlen = Math.round( x[i] / unit );

                // TODO adaptive unit

//                newunit = (unit + x[i]/newlen )/2
                resampled.push( newlen )
            }

            return resampled

        },

        unRLE : function(x){
            var output = [];
            var bit = 1;
            for ( var i = 0; i < x.length; i++){
                for ( var j = 0; j < x[i]; j++ ){
                    output.push( bit )
                }
                bit ^= 1
            }
            return output
        },

        parts : function(x,guardpos){
            var l,r;

            r = x.slice( guardpos + 5 )
            l = x.slice( 0, guardpos ).reverse()

            return { l : l, r : r }

        }



    }

} )();


