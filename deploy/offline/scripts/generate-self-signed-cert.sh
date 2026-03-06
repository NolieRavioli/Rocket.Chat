#!/bin/sh
set -eu

apk add --no-cache openssl >/dev/null

: "${CERT_DOMAIN:?CERT_DOMAIN is required}"

cert_dir=/certs
cert_file="${cert_dir}/${CERT_DOMAIN}.crt"
key_file="${cert_dir}/${CERT_DOMAIN}.key"

mkdir -p "${cert_dir}"

if [ -f "${cert_file}" ] && [ -f "${key_file}" ]; then
	echo "Certificate already exists for ${CERT_DOMAIN}"
	exit 0
fi

openssl req \
	-x509 \
	-nodes \
	-newkey rsa:4096 \
	-sha256 \
	-days "${CERT_DAYS:-825}" \
	-keyout "${key_file}" \
	-out "${cert_file}" \
	-subj "/C=${CERT_COUNTRY:-US}/ST=${CERT_STATE:-Local}/L=${CERT_LOCALITY:-Local}/O=${CERT_ORGANIZATION:-Local Rocket.Chat}/OU=${CERT_ORGANIZATIONAL_UNIT:-IT}/CN=${CERT_DOMAIN}" \
	-addext "subjectAltName=DNS:${CERT_DOMAIN}"

echo "Generated ${cert_file} and ${key_file}"
