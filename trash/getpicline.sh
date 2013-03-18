#!/bin/bash

if [ $# -ne 1 ]
    then
    echo "usage: $0 LINENUM < FILE"
    exit 1
fi

selectline=$1

read t
if [ "$t" == "P3" ]
then
    true
else 
    echo "unknown data file"
    exit
fi

read comment

read x y

#echo "[size: $x times $y]"

for xx in `seq 1 $y`
do
    for yy in `seq 1 $x`
    do
        read r
        read g
        read b
        if [ $xx -eq $selectline ]
        then
            echo $(( ( $r+$g+$b )/3 ))
        fi
    done
done
        
