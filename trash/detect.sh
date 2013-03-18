#!/usr/bin/php
<?php

$f = array_map( function($x){return(int)$x;}, file( "php://stdin" ) );

$offset = 0;

for ( $offset = 0; $offset < 20; $offset++ ){

    $start = implode( "", array_slice( $f, $offset + 0, 6 ) );
    $middle = implode( "", array_slice( $f, $offset + 46, 7 ) );
    $end = implode( "", array_slice( $f, $offset + 93, 6 ));

    echo "[$start $middle $end] ";
    if ( "$start::$middle::$end" == "001010::1010101::010100" ){
        echo "MATCH";
    }
    echo "\n";
}



