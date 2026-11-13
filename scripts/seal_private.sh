#!/bin/sh
# Seal the private Indian notes into an encrypted vault the daily GitHub Action can open.
#
#   sh scripts/seal_private.sh          (run from the portfolio folder)
#
# Packs ../PRIVATE/india-notes.json and ../PRIVATE/India Research Pack/files/ into
# private/india-vault.tar.gz.enc, encrypted with AES-256 using the key in
# ../PRIVATE/.vault-key. The same key is stored as the repository secret INDIA_VAULT_KEY,
# which is the only place the Action can read it from. Without the key the vault is
# unreadable, so it is safe in this public repository.
#
# Run this again whenever you add or change an Indian note in ../PRIVATE, then commit
# private/india-vault.tar.gz.enc.
set -eu
cd "$(dirname "$0")/.."
PRIV="../PRIVATE"
KEY="$PRIV/.vault-key"
[ -f "$KEY" ] || { echo "Missing $KEY"; exit 1; }
mkdir -p private
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/vault/files"
cp "$PRIV/india-notes.json" "$TMP/vault/"
cp "$PRIV/India Research Pack/files/"* "$TMP/vault/files/"
tar -czf "$TMP/vault.tar.gz" -C "$TMP" vault
openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -md sha256 -salt \
  -in "$TMP/vault.tar.gz" -out private/india-vault.tar.gz.enc -pass file:"$KEY"
# check it opens again before declaring success
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -md sha256 \
  -in private/india-vault.tar.gz.enc -pass file:"$KEY" | tar -tzf - > /dev/null
echo "Sealed $(ls "$TMP/vault/files" | wc -l | tr -d ' ') files + india-notes.json into private/india-vault.tar.gz.enc"
