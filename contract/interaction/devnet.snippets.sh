PROXY=https://devnet-gateway.multiversx.com
CHAIN_ID="D"

WALLET="./wallet.pem"
SPACE_OWNER="./wallet2.pem"
USER="./wallet3.pem"

ADDRESS=$(mxpy data load --key=address-devnet)
DEPLOY_TRANSACTION=$(mxpy data load --key=deployTransaction-devnet)


META_CHAIN_ADDRESS="erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u"
TOKEN="ITHEUM-a61317"
TOKEN_HEX="0x$(echo -n ${TOKEN} | xxd -p -u | tr -d '\n')"

deploy(){
    mxpy --verbose contract deploy \
    --bytecode output/reputation.wasm \
    --outfile deployOutput \
    --metadata-not-readable \
    --pem ${WALLET} \
    --proxy ${PROXY} \
    --chain ${CHAIN_ID} \
    --gas-limit 150000000 \
    --send \
    --recall-nonce \
    --outfile="./interaction/deploy-devnet.interaction.json" || return

    TRANSACTION=$(mxpy data parse --file="./interaction/deploy-devnet.interaction.json" --expression="data['emittedTransactionHash']")
    ADDRESS=$(mxpy data parse --file="./interaction/deploy-devnet.interaction.json" --expression="data['contractAddress']")

    mxpy data store --key=address-devnet --value=${ADDRESS}
    mxpy data store --key=deployTransaction-devnet --value=${TRANSACTION}
}




createSpace(){

  # $1 = token identifer (from issueSemiFungible)
  # $2 = space name

  token_identifier="0x$(echo -n ${1} | xxd -p -u | tr -d '\n')"
  name="0x$(echo -n ${2} | xxd -p -u | tr -d '\n')"
    

  mxpy --verbose contract call $ADDRESS \
    --recall-nonce \
    --pem=${SPACE_OWNER} \
    --gas-limit=10000000 \
    --function "createSpace" \
    --arguments $token_identifier $name \
    --proxy ${PROXY} \
    --chain ${CHAIN_ID} \
    --send || return


}


createCampaign(){

  # $1 = amount of esdt to send
  # $2 = name
  # $3 = media
  # $4 = claim amount (i.e 1,2,3)
  # $5 = automated bool
  # $6 = require whitelist (i.e true=01, false=00)
  # $7 = optional max supply (i.e 1000, if require whitelist is true, can be 0)
  # $8 = opt_start
  # $9 = opt_end 

  # 6 and 7 must be set together (ca be 0 to test without period)

  method="0x$(echo -n createCampaign | xxd -p -u | tr -d '\n')"
  name="0x$(echo -n ${2} | xxd -p -u | tr -d '\n')"
  media="0x$(echo -n ${3} | xxd -p -u | tr -d '\n')"



  mxpy --verbose contract call $ADDRESS \
    --recall-nonce \
    --gas-limit=15000000 \
    --pem=${SPACE_OWNER} \
    --function "ESDTTransfer" \
    --arguments ${TOKEN_HEX} $1 $method $name $media $4 $5 $6 $7 $8 $9 \
    --proxy ${PROXY} \
    --chain ${CHAIN_ID} \
    --send || return
    
}


issueSemiFungible(){

   # $1 = token name // this should be also the space name ( i think can be choosen by the space owner)
   # $2 = token ticker  ( this will be unique after this tx)


  collection_name="$(echo -n ${1} | xxd -p -u | tr -d '\n')" 
  collection_ticker="$(echo -n ${2} | xxd -p -u | tr -d '\n')"
  true="$(echo -n true | xxd -p -u | tr -d '\n')"
  canFreeze="$(echo -n canFreeze | xxd -p -u | tr -d '\n')"
  canWipe="$(echo -n canWipe | xxd -p -u | tr -d '\n')"
  canPause="$(echo -n canPause | xxd -p -u | tr -d '\n')"
  canTransferNFTCreateRole="$(echo -n canTransferNFTCreateRole | xxd -p -u | tr -d '\n')"
  canChangeOwner="$(echo -n canChangeOwner | xxd -p -u | tr -d '\n')"
  canUpgrade="$(echo -n canUpgrade | xxd -p -u | tr -d '\n')"
  canAddSpecialRoles="$(echo -n canAddSpecialRoles | xxd -p -u | tr -d '\n')"  

 
   mxpy --verbose tx new --receiver=${META_CHAIN_ADDRESS} \
    --recall-nonce \
    --pem=${SPACE_OWNER} \
    --gas-limit=150000000 \
    --value=50000000000000000 \
    --data "issueSemiFungible@$collection_name@$collection_ticker@$canFreeze@$true@$canWipe@$true@$canPause@$true@$canTransferNFTCreateRole@$true@$canChangeOwner@$true@$canUpgrade@$true@$canAddSpecialRoles@$true" \
    --proxy ${PROXY} \
    --chain ${CHAIN_ID} \
    --send || return

  # at this step you should go and check devnet for the token ticker 

}

setSpecialRoles(){

  # $1 = token identifier

  token_identifier="$(echo -n ${1} | xxd -p -u | tr -d '\n')"

  ESDTRoleNFTCreate="$(echo -n ESDTRoleNFTCreate | xxd -p -u | tr -d '\n')"
  ESDTRoleNFTBurn="$(echo -n ESDTRoleNFTBurn | xxd -p -u | tr -d '\n')"
  ESDTRoleNFTAddQuantity="$(echo -n ESDTRoleNFTAddQuantity | xxd -p -u | tr -d '\n')"
  ESDTTransferRole="$(echo -n ESDTTransferRole | xxd -p -u | tr -d '\n')"

  address="$(mxpy wallet bech32 --decode ${ADDRESS})"  
  
  mxpy --verbose tx new --receiver=${META_CHAIN_ADDRESS} \
    --recall-nonce \
    --pem=${SPACE_OWNER} \
    --gas-limit=150000000 \
    --data "setSpecialRole@$token_identifier@$address@$ESDTRoleNFTCreate@$ESDTRoleNFTBurn@$ESDTRoleNFTAddQuantity@$ESDTTransferRole" \
    --proxy ${PROXY} \
    --chain ${CHAIN_ID} \
    --send || return


}

whitelistParticipants() {
  # $1 = nonce
  # $2 = address


  address="0x$(mxpy wallet bech32 --decode ${2})"

  mxpy --verbose contract call ${ADDRESS} \
    --recall-nonce \
    --pem=${SPACE_OWNER} \
    --gas-limit=15000000 \
    --function "whitelistParticipants" \
    --arguments $1 $address \
    --proxy ${PROXY} \
    --chain ${CHAIN_ID} \
    --send || return
}

delistParticipants(){

  # $1 = nonce
  # $2 = address

  address="0x$(mxpy wallet bech32 --decode ${2})"

  mxpy --verbose contract call ${ADDRESS} \
    --recall-nonce \
    --pem=${SPACE_OWNER} \
    --gas-limit=15000000 \
    --function "delistParticipants" \
    --arguments $1 $address \
    --proxy ${PROXY} \
    --chain ${CHAIN_ID} \
    --send || return

}

setAdministrator(){
  # $1 = address

  address="0x$(mxpy wallet bech32 --decode ${1})"

  mxpy --verbose contract call ${ADDRESS} \
    --recall-nonce \
    --pem=${WALLET} \
    --gas-limit=6000000 \
    --function "setAdministrator" \
    --arguments $address \
    --proxy ${PROXY} \
    --chain ${CHAIN_ID} \
    --send || return
}

