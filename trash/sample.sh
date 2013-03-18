#!/usr/bin/php
<?php

$f = array_map( function($x){return(int)$x;}, file( "php://stdin" ) );

$every = (float) $argv[1];

function w( $array, $pos, $border ){
    $start = max( 0, $pos - $border );
    $end = min( $pos + $border, count( $array )-1);
    $len = $end - $start + 1;
    //    echo "pos=$pos border=$border start=$start end=$end len=$len\n";
    return array_slice( $array, $start, $len );
}


for ( $i = 0; $i < count( $f ); $i += $every ){

    echo round( array_sum( w( $f, round($i), 1 ) )/3 );

//    echo $f[ round( $i ) ];
    echo "\n";

}

