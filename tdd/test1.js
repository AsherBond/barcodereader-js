test( "BarcodeReader defined", function(){
    ok( BarcodeReader, "the class" );
} );

test( "BarcodeReader methods", function(){
    var methods = [
        'RLE',
        'detectGuards',
        'unRLE',
        'resample',
        'parts',
        'checkSync',
        'quantize',
        'readLine'
    ];

    expect( methods.length );

    for( var i=0; i < methods.length; i++ ){
        ok( BarcodeReader[ methods[i] ], 'method ' + methods[i] + ' defined' )
    }

} );

test( "BarcodeReader RLE works", function(){

    var testVectors = [
        [ "111010", [ 3,1,1,1 ] ],
        [ "01111", [ 1, 4 ] ],
        [ "10101", [ 1,1,1,1,1 ] ]
     ];

    expect( testVectors.length );

    for ( var i=0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.RLE( testVectors[i][0].match(/./g) ),
            testVectors[i][1]
        );
    }

} );

test( "BarcodeReader detectGuards works", function(){
    var testVectors = [
        [ "100,3,20,6,7,6,10,13,6,5,6,6,7,6,6,10,12,6,13,7", "8,9,10" ]
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.detectGuards( testVectors[i][0].split(',') ),
            testVectors[i][1].split(',').map( function(x){return +x} )
        )
    }

} );

test( "BarcodeReader resample", function(){

    var testVectors = [
        [ "3.1::6,6,7,6,5,3,2,9,10", "2,2,2,2,2,1,1,3,3" ]
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.resample(
                testVectors[i][0].split("::")[1].split(','),
                testVectors[i][0].split("::")[0]
            ),
            testVectors[i][1].split(',').map( function(x){ return window.parseInt(x); } )
        );
    };
});

test( "BarcodeReader unRLE works", function(){

    var testVectors = [
        [ "3,2,1,2,3,4,1,3,2", "111001001110000100011" ] 
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.unRLE(
              testVectors[i][0].split(',')
            ),
            testVectors[i][1].match(/./g).map(function(x){return window.parseInt(x)})
        );
    }

} );

test( "BarcodeReader parts works", function(){

    var testVectors = [
        {
            "pos" : 3,
            "data" : [ 100,3,20,6,6,6,6,6,1,2,3],
            "r" : [1,2,3],
            "l" : [20,3,100]
        }
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.parts( testVectors[i].data, testVectors[i].pos ),
            { "r" : testVectors[i].r, "l" : testVectors[i].l }
        )
    }

} );

test( "BarcodeReader checkSync", function(){
    var testVectors = [
        [ "1010101 1010111 1111000 1111000 1111111 0010101 1010", true ],
        [ "1010101 1010111 1111000 1111000 1111111 0010101 1010000", true ],
        [ "1010101 1010111 1111000 1111000 1111111 0010101 1010", true ],
        [ "1010101 1010111 1111000 1111000 1111111 0010101 101010111", true ],
        [ "1010101 1010111 1111000 1111000 1111111 0010101 101011111", true ],
        [ "1010101 1010111 1111000 1111000 1111111 0011", false ],
        [ "1010101 1010111 1111000 1111000 1111111 0010101", false ],
        [ "1010101 1010111 1111000 1111000 1111111 0010101 11111", false ],
        [ "1010101 1010111 1111000 1111000 1111111 0010101 0010", false ]
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        equal(
            BarcodeReader.checkSync( testVectors[i][0].replace(/[^01]/g,'') ),
            testVectors[i][1],
            testVectors[i].join( " is " )
        );
    }

} );

test( "BarcodeReader quantize", function(){

    var testVectors = [
        [ [10,30,10,30,11,31,8,30], [0,1,0,1,0,1,0,1], 2 ],
        [ [10,110,10,10,60,60,10,110,110,110,60,60,110,110], [0,1,0,0,1,1,0,1,1,1,0,0,1,1], 2 ],
        [ [10,110,10,10,65,65,10,110,110,110,65,65,110,110], [0,1,0,0,1,1,0,1,1,1,0,0,1,1], 2 ],
    ];

    for ( var i = 0; i < testVectors.length; i++ ){
        var border = testVectors[i][2]
        var input = testVectors[i][0]
        var output = testVectors[i][1]

        deepEqual(
            BarcodeReader.quantize( input, border ),
            output,
            input + " -> " + output
        );
    };

});


test( "BarcodeReader readLine", function(){



} );
