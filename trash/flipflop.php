#!/usr/bin/php
<?php

$f = array_map( function($x){ return (int)$x;}, file("php://stdin" ) );

$last = 0;
$count = 0;
foreach( $f as $line ){
    if ( $line == $last ){
        $count++;
    }
    else {
        echo "$count\n";
        $count=1;
    }
    $last = $line;
}
echo "$count\n";
