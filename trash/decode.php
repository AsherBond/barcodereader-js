#!/usr/bin/php
<?php

$line = file_get_contents("php://stdin");

$digits = explode( " ", $line );

$digits = array_map( "trim", $digits );

if ( preg_match( '/^..00101$/', $digits[0] ) ) echo "OK\n";
if ( preg_match( '/^10100..$/', $digits[13] ) ) echo "OK\n";


$dtab =<<<END
    0   0001101 0100111 1110010
    1   0011001 0110011 1100110
    2   0010011 0011011 1101100
    3   0111101 0100001 1000010
    4   0100011 0011101 1011100
    5   0110001 0111001 1001110
    6   0101111 0000101 1010000
    7   0111011 0010001 1000100
    8   0110111 0001001 1001000
    9   0001011 0010111 1110100
END;

$dtab = explode("\n", $dtab );
$dtab = array_map( function( $line ){
    preg_match( '/^\W+[0-9]\W+([01]{7})\W+([01]{7})\W+([01]{7})$/', $line, $M );

    return [
        "L" => $M[1],
        "G" => $M[2],
        "R" => $M[3]
    ];

}, $dtab);


foreach( $dtab as $ddigit => $dcodes ){

    $decodetab[ $dcodes['L']  ] = $ddigit."L";
    $decodetab[ $dcodes['G']  ] = $ddigit."G";
    $decodetab[ $dcodes['R']  ] = $ddigit."R";
}

//var_dump( $decodetab );

$digits = array_slice( $digits, 1, 12 );
foreach( $digits as $digit ){
    echo substr( $decodetab[ $digit ], 0, 1 );
}

echo "\n";

