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
        {
            input : "111010",
            output : [ 3,1,1,1 ] 
        },
        {
            input : "01111",
            output : [ 1, 4 ]
        },
        {
            input : "10101",
            output :[ 1,1,1,1,1 ]
        }
     ];

    expect( testVectors.length );

    for ( var i=0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.RLE( testVectors[i].input.match(/./g) ),
            testVectors[i].output
        );
    }

} );

test( "BarcodeReader detectGuards works", function(){
    var testVectors = [
        {
            type    : "ean13",
            input   : [ 100,3,20,6,7,6,10,13,6,5,6,6,7,6,6,10,12,6,13,7 ],
            output  : [ 8,9,10 ]
        }
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.detectGuards( testVectors[i].input, testVectors[i].type ),
            testVectors[i].output
        )
    }

} );

test( "BarcodeReader resample", function(){

    var testVectors = [
        {
            unit : 3.1,
            input : [ 6,6,7,6,5,3,2,9,10 ],
            output : [ 2,2,2,2,2,1,1,3,3 ]
        }
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.resample( testVectors[i].input, testVectors[i].unit ),
            testVectors[i].output
        );
    };
});

test( "BarcodeReader unRLE works", function(){

    var testVectors = [
        {
            input : [ 3,2,1,2,3,4,1,3,2 ], 
            output : "111001001110000100011"
        }
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        deepEqual(
            BarcodeReader.unRLE(
              testVectors[i].input
            ),
            testVectors[i].output.match(/./g).map(function(x){return window.parseInt(x)})
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
            {
                "r" : testVectors[i].r,
                "l" : testVectors[i].l
            }
        )
    }

} );

test( "BarcodeReader checkSync", function(){
    var testVectors = [
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0010101 1010",      output : true },
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0010101 1010000",   output : true },
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0010101 1010",      output : true },
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0010101 101010111", output : true },
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0010101 101011111", output : true },
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0011",              output : false },
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0010101",           output : false },
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0010101 11111",     output : false },
        { type : "ean13", input :  "1010101 1010111 1111000 1111000 1111111 0010101 0010",      output : false }
    ];

    expect( testVectors.length );

    for ( var i = 0; i < testVectors.length; i++ ){
        equal(
            BarcodeReader.checkSync(
                testVectors[i].input.replace(/[^01]/g,'').match(/./g),
                testVectors[i].type
            ),
            testVectors[i].output,
            testVectors[i].input + " is " + testVectors[i].output
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
