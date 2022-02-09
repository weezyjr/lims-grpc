#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

PROTO_DEST=./src/proto

mkdir -p ${PROTO_DEST}

$(npm bin)/proto-loader-gen-types --longs=String \
    --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js \
    --outDir=${PROTO_DEST}/models ${PROTO_DEST}/*.proto
