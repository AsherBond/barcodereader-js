#!/usr/bin/php
<?php

function w( $array, $pos, $border ){
    $start = max( 0, $pos - $border );
    $end = min( $pos + $border, count( $array )-1);
    $len = $end - $start + 1;
//    echo "pos=$pos border=$border start=$start end=$end len=$len\n";
    return array_slice( $array, $start, $len );
}

$f = array_map( function($x){return(int)$x;}, file( "php://stdin" ) );

$base_pivot = (max( $f ) + min( $f ))/2;

foreach( $f as $n => $val ){
    $b = 4;
    $w = w( $f, $n, $b );
    $avg = array_sum( $w ) / count( $w );
    $pivot = ($base_pivot + $avg)/2;
    echo ( $val > $pivot ? 0 : 1 ) . "\n";
}
