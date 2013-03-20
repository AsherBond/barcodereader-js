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

        },

        checkSync : function(x,type){
            // x - array of 0s and 1s
            
            switch( type ){
                case "ean13":
                    return !! x.slice( 6 * 7 ).join('').match( /^1010/ );
                default:
                    throw new Error( "unknown barcode type " + type );
            }

        },

        quantize : function(x, b){
            var threshold 
            var border = b || 10

            var q = []

            threshold = ( Math.max.apply( null, x ) + Math.min.apply( null, x ) ) / 2
            
            for ( var i = 0; i < x.length; i++ ){
                var localsur = x.slice(
                    Math.max( i - border, 0 ),
                    Math.min( i + border, x.length )
                );
                var lt = (
                    threshold 
                    + localsur.reduce( function(x,y){ return x + y } ) / ( 2 * border + 1 )
                ) / 2;

                q.push( x[i] > lt ? 0 : 1 )
            }

            return q

        },

        loadImage : function( img ){


        },

        getLineFromImage : function( img, lines ){

            if ( "string" === typeof img ){
                var imgsrc = img;
                img = document.createElement("img");
                img.src = imgsrc;
            } 

            if ( ! ( lines instanceof Array ) ){
                if ( "number" === typeof lines ){
                    lines = [ lines ]
                }
                else if ( "string" === typeof lines ){
                    lines = [ parseInt( lines ) ]
                }
                else {
                    throw new Error( "Unknown lines specification" )
                }
            }
            if ( "object" !== typeof img || img.nodeName != "IMG" ){
                throw new Error( "Wrong parameter to getLineFromImage" );
            }
            if ( img.width == 0 || img.height == 0 ){
                throw new Error( "img size 0" )
            }

            var cnv = document.createElement('canvas');
            var ctx = cnv.getContext('2d');

            cnv.width = img.width;
            cnv.height = img.height;
            ctx.drawImage( img, 0, 0 );

            picline = []

            for ( var j = 0; j < img.width; j++ ){
                picline[j]=0;
            }

            for ( var i = 0; i < lines.length; i ++ ){

                if ( lines[i] > img.height ){
                    throw new Error("Line number out of range");
                }

                var pxbuffer = ctx.getImageData(
                    0, lines[i], // FIXME
                    img.width, 1
                ).data;

                var pxgraybuffer = this.convertRGBALineToGrayscale( pxbuffer );

 //               console.log( "grayline " + i, pxgraybuffer );

                for ( var j = 0; j < img.width; j++ ){
                    picline[j] += pxgraybuffer[j]
                }
            }

            picline = picline.map( function(x){ return x/lines.length } )

//            console.log( "picline", picline );

            return picline

        },

        convertRGBALineToGrayscale : function(){
            throw new Error("it's GRAYSCALE");
        },

        convertRGBALineToGrayscale : function( line ){
            var output = [];
            for ( var j = 0; j < line.length; j+=4 ){
                output.push( Math.round( 
                    + 0.30 * line[j] 
                    + 0.59 * line[j+1] 
                    + 0.11 * line[j+2]
                ) );
            }
            return output
        },

        drawLine : function( img, line, n, border ){

            border = 10

            var cnv = document.createElement('canvas');
            var ctx = cnv.getContext('2d');

            cnv.width = img.width;
            cnv.height = img.height;
            ctx.drawImage( img, 0, 0 );

            img.parentNode.replaceChild( cnv, img );

            var buffer = ctx.createImageData( img.width, border + 1 );

            for ( var i =0; i < img.width; i++ ){
                for ( j = 0; j < border + 1; j++ ){
                    var pos = i * 4 + j * 4 * img.width;
                    buffer.data[ pos ] = 
                    buffer.data[ pos + 1 ] =
                    buffer.data[ pos + 2 ] = 
                        ( line[i] == 1 ) ? 0 : 255
                    buffer.data[ pos + 3 ] = 255
                 }
            }

            console.log( buffer.data )

            ctx.putImageData( buffer, 0, n )

        },

        reverse : function( input, type ){
            switch( type ){
                case "ean13":
                    return input.match(/[01]/g).slice(0,6*7).reverse().join('')
                default:
                    throw new Error("reverse: unknown code type " + type );
            }
        },

        decode : function( input, type ){

            var base_patterns = [ "00110", "01100", "01001", "11110", "10001", "11000", "10111", "11101", "11011", "00101" ];
            
            var neg_patt = (function(x){ return x.replace('0','x').replace('1','0').replace('x','1') })
            var rev_patt = (function(x){ return x.match(/./g).reverse().join('') } )

            var Lcodes = base_patterns.map( function(x){ return "0"+x+"1" } )
            var Gcodes = base_patterns.map( rev_patt ).map( neg_patt ).map( function(x){ return "0"+x+"1" } )
            var Rcodes = base_patterns.map( neg_patt ).map( function(x){ return "1"+x+"0" } )
            
            console.log( Lcodes.join(), Gcodes.join(), Rcodes.join() ) 


        }
    }

} )();


