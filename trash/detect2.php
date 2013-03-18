#!/usr/bin/php
<?php

$f = array_map( function($x){ return (int)$x;}, file("php://stdin" ) );

for ( $i = 4; $i < count( $f ) - 4; $i++ ){

    $subseq = array_slice( $f, $i, 5 );
    $min = min( $subseq );
    $max = max( $subseq );

    $unit = array_sum( $subseq )/5;

    if ( $max / $min < 1.3 ){
        echo "MIDDLE GUARD MATCHED AT $i with unit $unit\n";
        $guard = $i;
        goto unroll;
    }
}

exit(1);

unroll:

//echo "reverse unrolling left part:\n";
$stack = [];
$bit = "1";
for ( $i = $guard - 1; $i > 0; $i-- ){
    $numbits = round( $f[$i] / $unit );
    while( $numbits -- ){
        $stack[] = $bit;
    }
    $bit = ( $bit === "1" ) ? "0":"1";
}

$stack = array_chunk( $stack, 7 );
$stack = array_map( function($x){ return implode("", $x); }, $stack );
$stack = array_map( function($x){ return strrev( $x ); }, $stack );
$stack = array_slice( $stack, 0, 7 );
$stack = array_reverse( $stack );
echo implode( " ", $stack );

echo " ";
//echo "unrolling right part:\n";
$stack = [];
$bit = "1";
for ( $i = $guard + 5; $i < count( $f ); $i++ ){
    $numbits = round ($f[$i] / $unit);
    while( $numbits -- ){
        $stack[] = $bit;
    }
    $bit = ( $bit === "1" ) ? "0":"1";
}
$stack = array_chunk( $stack, 7 );
$stack = array_map( function($x){ return implode("",$x); }, $stack );
echo implode( " ", array_splice( $stack, 0, 7 ) );
echo "\n";
